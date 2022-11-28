import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../../components/layout/MetaData";
import { Link, useParams } from "react-router-dom";
import SideBar from "../../components/admin/Sidebar";
import { useAlert } from "react-alert";
import { dolaSymbol } from "../../constants/constants";
import {
  getOrderDetails,
  clearErrors,
  updateOrder,
} from "../../actions/orderAction";
import Loader from "../../components/layout/Loader/Loader";
import Button from "../../components/user/Button";
import { AccountTree } from "@material-ui/icons";
import { UPDATE_ORDER_RESET } from "../../constants/orderConstants";

const ProcessOrder = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const params = useParams();

  const { order, error, loading } = useSelector((state) => state.orderDetails);
  const {
    error: updateError,
    isUpdated,
    loading: loadingOrder,
  } = useSelector((state) => state.order);
  const [status, setStatus] = useState("");

  const updateProcessOrder = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("status", status);

    dispatch(updateOrder(params.id, myForm));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success("Order Updated Successfully");
      dispatch({ type: UPDATE_ORDER_RESET });
    }

    dispatch(getOrderDetails(params.id));
  }, [alert, dispatch, error, isUpdated, updateError, params.id]);

  return (
    <Fragment>
      <MetaData title={`Process Order - Admin`} />

      {/* dashboard */}
      <div className="dashboardStyle">
        <div className="sidebarStyle">
          <SideBar />
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className="dashboardRightBoxStyle">
            <div className="mb-5">
              <p className="upper text-center text-2xl font-bold text-gray-400">
                UPDATE ORDER
              </p>
            </div>
            <div className="px-10">
              <div className="grid grid-col-1 tall:grid-cols-6 divide-y-2 tall:divide-y-0 tall:divide-x-2 divide-secondaryDark">
                <div className="flex flex-col col-span-6 tall:col-span-4">
                  <div>
                    <p className="text-xl font-bold">Shipping Info</p>
                    <div className="headingData">
                      <div className="flex gap-3 ">
                        <p>Name: </p>
                        <span className="text-slate-600">
                          {order.shippingInfo && order.shippingInfo.fullname}
                        </span>
                      </div>
                      <div className="flex gap-3 ">
                        <p>Phone: </p>
                        <span className="text-slate-600">
                          {order.shippingInfo && order.shippingInfo.phoneNo}
                        </span>
                      </div>
                      <div className="flex gap-3 ">
                        <p>Address: </p>
                        <span className="text-slate-600">
                          {order.shippingInfo &&
                            `${order.shippingInfo.address}, ${order.shippingInfo.city}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="heading">Payment Details</p>
                    <div className="headingData">
                      <div className="flex gap-3">
                        <p>Payment: </p>
                        <p
                          className={`${
                            order.paymentInfo &&
                            order.paymentInfo.status === "succeeded"
                              ? "text-green-500"
                              : "text-red-500"
                          }  `}
                        >
                          {order.paymentInfo &&
                          order.paymentInfo.status === "succeeded"
                            ? "PAID"
                            : "NOT PAID"}
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <p>Amount: </p>
                        <span className="text-slate-600">
                          {dolaSymbol}
                          {order.totalPrice && order.totalPrice}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="heading">Order Status</p>
                    <div className="headingData">
                      <div className="flex gap-3">
                        <p className="flex gap-3">
                          Order:{" "}
                          <p
                            className={`${
                              order.orderStatus &&
                              order.orderStatus === "Delivered"
                                ? "text-green-500"
                                : "text-red-500"
                            }  `}
                          >
                            {order.orderStatus && order.orderStatus}
                          </p>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="my-5">
                    <p className="text-xl font-bold">Your Cart Items: </p>
                    <div>
                      {order.orderItems?.map((item, index) => {
                        return (
                          <div
                            key={index}
                            className="flex px-5 md:px-10 gap-x-7 mt-3 items-center"
                          >
                            <img
                              className="w-[10vmax] md:w-[5vmax]"
                              src={item.image}
                              alt="Product"
                            />
                            <Link
                              className="capitalize"
                              to={`/product/${item.product}`}
                            >
                              {item.name}
                            </Link>
                            <span>
                              {item.quantity} X {dolaSymbol}
                              {item.price} ={" "}
                              <b>
                                {dolaSymbol}
                                {item.price * item.quantity}
                              </b>
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/*  */}
                {order.orderStatus !== "Delivered" && (
                  <div className="tall:pl-8 py-5  mt-3 md:mt-0 col-span-6 tall:col-span-2">
                    <form
                      className="w-[100%] h-[60vh] flex flex-col gap-6 justify-center items-center mx-auto shadow-lg bg-white p-5 rounded-md"
                      onSubmit={updateProcessOrder}
                    >
                      <div className="text-center mb-10">
                        <p className="text-xl font-medium text-gray-600 pb-3 border-b-2">
                          Process Order
                        </p>
                      </div>
                      <div className="w-full mb-2">
                        <div className="flex gap-2 justify-evenly flex-col h-full ">
                          <div className="bg-primaryBlue rounded-lg overflow-hidden w-full flex justify-start items-center">
                            <AccountTree className="text-xl text-white mx-2" />
                            <select
                              value={status}
                              className="px-3 py-2 outline-none border-2 w-full"
                              onChange={(e) => setStatus(e.target.value)}
                            >
                              <option value="">Choose Status</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="w-fit mx-auto">
                        <Button
                          label="Process"
                          disabled={
                            loadingOrder
                              ? true
                              : false || status === ""
                              ? true
                              : false
                          }
                        />{" "}
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default ProcessOrder;
