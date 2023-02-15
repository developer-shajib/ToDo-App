import React, { Component } from "react";
import "./Todo.scss";
import {
  BsCheckCircleFill,
  BsFillPinFill,
  BsFillStopCircleFill,
  BsFillTrashFill,
  BsXCircleFill,
} from "react-icons/bs";
import axios from "axios";
import swal from "sweetalert";

export class Todo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: { title: "", status: "cancel" },
      pending: [],
      cancel: [],
      complete: [],
    };
  }

  // Input Change
  handleInputChange = (e) => {
    this.setState((prevState) => ({
      ...prevState,
      input: { ...prevState.input, title: e.target.value },
    }));
  };

  // Form submit
  handleFormSubmit = (e) => {
    e.preventDefault();

    axios.post("http://localhost:5050/todo", this.state.input).then((res) => {
      this.setState((prevState) => ({
        ...prevState,
        input: {
          title: "",
          status: "cancel",
        },
        cancel: [...prevState.cancel, res.data],
      }));
    });
  };

  // Delete Btn
  handleDeleteBtn = (id, status) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this imaginary file!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios.delete(`http://localhost:5050/todo/${id}`).then((res) => {
          if (status === "cancel") {
            this.setState((prevState) => ({
              ...prevState,
              cancel: [...prevState.cancel.filter((data) => data.id !== id)],
            }));
          }
          if (status === "pending") {
            this.setState((prevState) => ({
              ...prevState,
              pending: [...prevState.pending.filter((data) => data.id !== id)],
            }));
          }
          if (status === "complete") {
            this.setState((prevState) => ({
              ...prevState,
              complete: [
                ...prevState.complete.filter((data) => data.id !== id),
              ],
            }));
          }
        });
        swal("Poof! Your imaginary file has been deleted!", {
          icon: "success",
        });
      }
    });
  };

  handlePendingBtn = (id, status, title) => {
    axios
      .patch(`http://localhost:5050/todo/${id}`, {
        title: title,
        status: "pending",
      })
      .then((res) => {
        if (status === "complete") {
          this.setState((prevState) => ({
            ...prevState,
            complete: [...prevState.complete.filter((data) => data.id !== id)],
            pending: [...prevState.pending, res.data],
          }));
        } else {
          this.setState((prevState) => ({
            ...prevState,
            cancel: [...prevState.cancel.filter((data) => data.id !== id)],
            pending: [...prevState.pending, res.data],
          }));
        }
      });
  };

  handleCompleteBtn = (id, status, title) => {
    axios
      .patch(`http://localhost:5050/todo/${id}`, {
        title: title,
        status: "complete",
      })
      .then((res) => {
        if (status === "pending") {
          this.setState((prevState) => ({
            ...prevState,
            pending: [...prevState.pending.filter((data) => data.id !== id)],
            complete: [...prevState.complete, res.data],
          }));
        } else {
          this.setState((prevState) => ({
            ...prevState,
            cancel: [...prevState.cancel.filter((data) => data.id !== id)],
            complete: [...prevState.complete, res.data],
          }));
        }
      });
  };

  handleCancelBtn = (id, status, title) => {
    axios
      .patch(`http://localhost:5050/todo/${id}`, {
        title: title,
        status: "cancel",
      })
      .then((res) => {
        if (status === "pending") {
          this.setState((prevState) => ({
            ...prevState,
            pending: [...prevState.pending.filter((data) => data.id !== id)],
            cancel: [...prevState.cancel, res.data],
          }));
        } else {
          this.setState((prevState) => ({
            ...prevState,
            complete: [...prevState.complete.filter((data) => data.id !== id)],
            cancel: [...prevState.cancel, res.data],
          }));
        }
      });
  };

  componentDidMount = () => {
    axios.get("http://localhost:5050/todo").then((res) => {
      this.setState((prevState) => ({
        ...prevState,
        cancel: [...res.data.filter((data) => data.status === "cancel")],
        pending: [...res.data.filter((data) => data.status === "pending")],
        complete: [...res.data.filter((data) => data.status === "complete")],
      }));
    });
  };

  render() {
    const { input, pending, cancel, complete } = this.state;
    return (
      <>
        <div className="todo py-3">
          <div className="container ">
            {/* ============ ToDo Form Part ============ */}
            <div className="row form-row justify-content-center my-3">
              <div className="col-md-6">
                <div className="card shadow">
                  <div className="card-header">
                    <h2 style={{ textAlign: "center" }}>ToDo App</h2>
                  </div>
                  <div className="card-body">
                    <div className="todo-form">
                      <form
                        onSubmit={this.handleFormSubmit}
                        action=""
                        className="d-flex "
                      >
                        <input
                          value={input.title}
                          onChange={this.handleInputChange}
                          type="text"
                          className="form-control"
                        />
                        <button className="btn btn-primary">Add</button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ============ ToDo List Part ============ */}

            <div className="content">
              <div className="box1 shadow">
                <div className="list-all">
                  <h5>Cancel List</h5>
                  <div className="box-item">
                    <ul className="list-group">
                      {cancel.length > 0 ? (
                        <>
                          {cancel.map((item, index) => {
                            return (
                              <>
                                {item.status === "cancel" && (
                                  <li className="list-group-item" key={index}>
                                    <div className="list-info">
                                      <span>
                                        <BsFillPinFill />
                                      </span>
                                      <p>{item.title}</p>
                                    </div>
                                    <div className="list-btn">
                                      <button
                                        onClick={() =>
                                          this.handlePendingBtn(
                                            item.id,
                                            item.status,
                                            item.title
                                          )
                                        }
                                      >
                                        <BsFillStopCircleFill />
                                      </button>
                                      <button
                                        onClick={() =>
                                          this.handleCompleteBtn(
                                            item.id,
                                            item.status,
                                            item.title
                                          )
                                        }
                                      >
                                        <BsCheckCircleFill />
                                      </button>
                                      <button
                                        onClick={() =>
                                          this.handleDeleteBtn(
                                            item.id,
                                            item.status
                                          )
                                        }
                                      >
                                        <BsFillTrashFill />
                                      </button>
                                    </div>
                                  </li>
                                )}
                              </>
                            );
                          })}
                        </>
                      ) : (
                        <h3
                          style={{
                            backgroundColor: "white",
                            textAlign: "center",
                            borderRadius: "6px",
                            fontSize: "20px",
                            padding: "10px 0px",
                          }}
                        >
                          No list here
                        </h3>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="box2 shadow">
                <div className="list-all">
                  <h5>Pending List</h5>
                  <div className="box-item">
                    <ul className="list-group">
                      {pending.length > 0 ? (
                        <>
                          {pending.map((item, index) => {
                            return (
                              <>
                                {item.status === "pending" && (
                                  <li className="list-group-item" key={index}>
                                    <div className="list-info">
                                      <span>
                                        <BsFillPinFill />
                                      </span>
                                      <p>{item.title}</p>
                                    </div>
                                    <div className="list-btn">
                                      <button
                                        onClick={() =>
                                          this.handleCancelBtn(
                                            item.id,
                                            item.status,
                                            item.title
                                          )
                                        }
                                      >
                                        <BsXCircleFill />
                                      </button>
                                      <button
                                        onClick={() =>
                                          this.handleCompleteBtn(
                                            item.id,
                                            item.status,
                                            item.title
                                          )
                                        }
                                      >
                                        <BsCheckCircleFill />
                                      </button>
                                      <button
                                        onClick={() =>
                                          this.handleDeleteBtn(
                                            item.id,
                                            item.status,
                                            item.title
                                          )
                                        }
                                      >
                                        <BsFillTrashFill />
                                      </button>
                                    </div>
                                  </li>
                                )}
                              </>
                            );
                          })}
                        </>
                      ) : (
                        <>
                          <h3
                            style={{
                              backgroundColor: "white",
                              textAlign: "center",
                              borderRadius: "6px",
                              fontSize: "20px",
                              padding: "10px 0px",
                            }}
                          >
                            No list here
                          </h3>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="box3 shadow">
                <div className="list-all">
                  <h5>Complete List</h5>
                  <div className="box-item">
                    <ul className="list-group">
                      {complete.length > 0 ? (
                        <>
                          {complete.map((item, index) => {
                            return (
                              <>
                                {item.status === "complete" && (
                                  <li className="list-group-item" key={index}>
                                    <div className="list-info">
                                      <span>
                                        <BsFillPinFill />
                                      </span>
                                      <p>{item.title}</p>
                                    </div>
                                    <div className="list-btn">
                                      <button
                                        onClick={() =>
                                          this.handleCancelBtn(
                                            item.id,
                                            item.status,
                                            item.title
                                          )
                                        }
                                      >
                                        <BsXCircleFill />
                                      </button>
                                      <button
                                        onClick={() =>
                                          this.handlePendingBtn(
                                            item.id,
                                            item.status,
                                            item.title
                                          )
                                        }
                                      >
                                        <BsFillStopCircleFill />
                                      </button>
                                      <button
                                        onClick={() =>
                                          this.handleDeleteBtn(
                                            item.id,
                                            item.status
                                          )
                                        }
                                      >
                                        <BsFillTrashFill />
                                      </button>
                                    </div>
                                  </li>
                                )}
                              </>
                            );
                          })}
                        </>
                      ) : (
                        <>
                          <h3
                            style={{
                              backgroundColor: "white",
                              textAlign: "center",
                              borderRadius: "6px",
                              fontSize: "20px",
                              padding: "10px 0px",
                            }}
                          >
                            No list here
                          </h3>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Todo;
