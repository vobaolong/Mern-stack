import React, { Fragment, useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  getAllReviews,
  deleteReviews,
} from "../../actions/productAction";
import SideBar from "../../components/admin/Sidebar";
import { useAlert } from "react-alert";
import { useNavigate } from "react-router-dom";

import Button from "../../components/user/Button";
import MetaData from "../../components/layout/MetaData";
import { Delete, Star } from "@material-ui/icons";
import { DELETE_REVIEW_RESET } from "../../constants/productConstants";
import InputField from "../../components/user/InputField";

const ProductReviews = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert = useAlert();

  const [productId, setProductId] = useState("");

  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.review
  );

  const { error, reviews, loading } = useSelector(
    (state) => state.productReviews
  );

  useEffect(() => {
    if (productId.length === 24) {
      dispatch(getAllReviews(productId));
    }

    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      alert.success("Review is Deleted Successfully");
      navigate("/admin/reviews");
      dispatch({ type: DELETE_REVIEW_RESET });
    }
  }, [dispatch, error, alert, deleteError, isDeleted, navigate, productId]);

  const deleteReviewHandler = (reviewId) => {
    dispatch(deleteReviews(reviewId, productId));
  };

  const productReviewsSubmitHandler = (e) => {
    e.preventDefault();
    dispatch(getAllReviews(productId));
  };

  const columns = [
    { field: "id", headerName: "Review ID", minWidth: 200, flex: 0.5 },

    {
      field: "user",
      headerName: "User",
      minWidth: 150,
      flex: 0.3,
    },
    {
      field: "comment",
      headerName: "Comment",
      type: "number",
      minWidth: 300,
      flex: 0.6,
    },

    {
      field: "rating",
      headerName: "Rating",
      type: "number",
      minWidth: 100,
      flex: 0.2,

      cellClassName: (params) => {
        return params.getValue(params.id, "rating") >= 3
          ? "text-green-500"
          : "text-red-500";
      },
    },

    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>
            <button
              className="text-red-400 mx-7 hover:text-red-500 transition-all duration-300"
              onClick={() =>
                deleteReviewHandler(params.getValue(params.id, "id"))
              }
            >
              <Delete />
            </button>
          </Fragment>
        );
      },
    },
  ];

  const rows = [];

  reviews &&
    reviews.forEach((item) => {
      rows.push({
        id: item._id,
        rating: item.rating,
        comment: item.comment,
        user: item.name,
      });
    });

  return (
    <Fragment>
      <MetaData title={`All Reviews - Admin`} />

      {/* dashboard */}
      <div className="dashboardStyle">
        <div className="sidebarStyle">
          <SideBar />
        </div>

        <div className="dashboardRightBoxStyle">
          <div className="mb-5">
            <p className="upper text-center text-2xl font-bold text-gray-400">
              ALL REVIEWS
            </p>
          </div>

          <form
            className="w-[90%]  md:w-[50%] mx-auto shadow-lg bg-white p-10 rounded-md"
            onSubmit={productReviewsSubmitHandler}
          >
            <div className="w-full mb-2">
              <div className="flex gap-5 justify-evenly flex-col h-full ">
                <InputField
                  inputType="text"
                  name="username"
                  Icon={Star}
                  placeholder="Place product Id"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                />
              </div>
            </div>
            <div className="w-fit mx-auto mt-5">
              <Button
                disabled={loading ? true : false}
                label="Search Reviews"
              />
            </div>
          </form>

          {reviews?.length > 0 ? (
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              disableSelectionOnClick
              className="w-[95%] mx-auto mt-10"
              autoHeight
            />
          ) : (
            <p className="text-center text-gray-400 text-xl mt-10">
              No Reviews Found
            </p>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default ProductReviews;
