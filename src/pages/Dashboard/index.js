import axios from "axios";
import React, { useEffect, useState } from "react";
import * as S from "./styles";
import { Row, Col, Divider, Button, Modal, message, Input } from "antd";

const Dashboard = (props) => {
    const [users, setUsers] = useState([]);
    const [createUserModal, toggleCreateUserModal] = useState(false);
    const [updateUserModal, toggleUpdateUserModal] = useState(false);
    const [notificationModal, toggleNotificationModal] = useState(false);

    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [validTill, setValidTill] = useState("");

    const [updateId, setUpdateId] = useState("");

    const [notificationHeader, setNotificationHeader] = useState("");
    const [notificationBody, setNotificationBody] = useState("");
    const [notificationId, setNotificationId] = useState("");

    useEffect(() => {
        if (localStorage.getItem("varillaadmin") === "loggedin") {
            //do something
            axios
                .get("/users")
                .then((res) => {
                    console.log(res.data);
                    setUsers(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });

            axios
                .get("/notification")
                .then((res) => {
                    setNotificationHeader(res.data[0].header);
                    setNotificationBody(res.data[0].body);
                    setNotificationId(res.data[0]._id);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            props.history.push("/");
        }
    }, [props.history]);

    const deleteUser = (userid) => {
        axios
            .delete("/users", { data: { userid: userid } })
            .then((res) => {
                const toRemove = res.data;

                const afterRemoval = users.filter((user) => {
                    return user._id !== toRemove._id;
                });

                setUsers(afterRemoval);

                message.success("User deleted successfully !");
            })
            .catch((err) => {
                console.log(err);
                message.error("Cannot delete user !");
            });
    };

    const createUser = () => {
        axios
            .post("/users", { name, phoneNumber, address, validTill })
            .then((res) => {
                let afterAdding = users;
                afterAdding.push(res.data);
                setUsers(afterAdding);
                toggleCreateUserModal(false);
                message.success("User created successfully !");
            })
            .catch((err) => {
                console.log(err);
                message.error("User could not be created !");
            });
    };

    const updateUser = () => {
        axios
            .put("/users", {
                name: name,
                phoneNumber: phoneNumber,
                address: address,
                validTill: validTill,
                userid: updateId,
            })
            .then((res) => {
                const toRemove = res.data;

                const afterRemoval = users.filter((user) => {
                    return user._id !== toRemove._id;
                });

                let afterAdding = afterRemoval;
                afterAdding.push(res.data);
                setUsers(afterAdding);
                toggleUpdateUserModal(false);
                setUpdateId("");
                setName("");
                setPhoneNumber("");
                setAddress("");
                setValidTill("");

                message.success("Updated the user !");
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const updateNotifications = () => {
        axios
            .put("/notification", {
                header: notificationHeader,
                body: notificationBody,
                notificationid: notificationId,
            })
            .then((res) => {
                message.success("Notification updated !");
                toggleNotificationModal(false);
            })
            .catch((err) => {
                message.error("Can't update !");
            });
    };

    return (
        <>
            {/* create new user modal */}
            <Modal
                title="Create New User"
                centered
                footer={null}
                visible={createUserModal}
                onOk={() => toggleCreateUserModal(false)}
                onCancel={() => toggleCreateUserModal(false)}
            >
                <p>Enter following details</p>
                <br />

                <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                />
                <br />
                <br />
                <Input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Phone Number"
                />
                <br />
                <br />
                <Input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Address"
                />
                <br />
                <br />
                <Input
                    type="text"
                    value={validTill}
                    onChange={(e) => setValidTill(e.target.value)}
                    placeholder="Valid Till"
                />
                <br />
                <br />
                <Button onClick={createUser}>Create</Button>
            </Modal>

            {/* update user modal */}
            <Modal
                title="Update User"
                centered
                footer={null}
                visible={updateUserModal}
                onOk={() => {
                    toggleUpdateUserModal(false);
                    setUpdateId("");
                    setName("");
                    setPhoneNumber("");
                    setAddress("");
                    setValidTill("");
                }}
                onCancel={() => {
                    toggleUpdateUserModal(false);
                    setUpdateId("");
                    setName("");
                    setPhoneNumber("");
                    setAddress("");
                    setValidTill("");
                }}
            >
                <p>Enter following details</p>
                <br />

                <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                />
                <br />
                <br />
                <Input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Phone Number"
                />
                <br />
                <br />
                <Input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Address"
                />
                <br />
                <br />
                <Input
                    type="text"
                    value={validTill}
                    onChange={(e) => setValidTill(e.target.value)}
                    placeholder="Valid Till"
                />
                <br />
                <br />
                <Button onClick={updateUser}>Update</Button>
            </Modal>

            {/* notification modal */}
            <Modal
                title="Notification"
                centered
                footer={null}
                visible={notificationModal}
                onOk={() => toggleNotificationModal(false)}
                onCancel={() => toggleNotificationModal(false)}
            >
                <p>Notification details</p>
                <br />

                <Input
                    type="text"
                    value={notificationHeader}
                    onChange={(e) => setNotificationHeader(e.target.value)}
                    placeholder="Notification Header"
                />
                <br />
                <br />
                <Input
                    type="text"
                    value={notificationBody}
                    onChange={(e) => setNotificationBody(e.target.value)}
                    placeholder="Notification Body"
                />
                <br />
                <br />
                <Button onClick={updateNotifications}>Update</Button>
            </Modal>

            <S.Container>
                <h1>Dashboard</h1>

                <br />
                <br />

                <h3>CREATE NEW USER</h3>
                <Button
                    onClick={() => toggleCreateUserModal(true)}
                    style={{ marginRight: "10px" }}
                >
                    Create user
                </Button>

                <Button
                    style={{ marginRight: "10px" }}
                    onClick={() => toggleNotificationModal(true)}
                >
                    View Notification
                </Button>

                <Button
                    onClick={() => {
                        localStorage.setItem("varillaadmin", null);
                        props.history.push("/");
                    }}
                >
                    Logout
                </Button>
                <br />
                <br />

                <h4 style={{ fontWeight: "bolder", color: "green" }}>
                    Total Users : {users.length}
                </h4>

                <h3>USER INFO</h3>
                <br />
                <div>
                    <Row>
                        <Col span={6}>
                            <strong>Name</strong>
                        </Col>
                        <Col span={4}>
                            <strong>Phone Number</strong>
                        </Col>
                        <Col span={4}>
                            <strong>ActivationKey</strong>
                        </Col>
                        <Col span={4}>
                            <strong>Valid Till</strong>
                        </Col>
                        <Col span={6}>
                            <strong>Operations</strong>
                        </Col>
                    </Row>

                    {users.length === 0 && (
                        <>
                            <br />
                            <br />
                            <br />
                            <Row>
                                <Col span={6}>Empty</Col>
                                <Col span={4}>Empty</Col>
                                <Col span={4}>Empty</Col>
                                <Col span={4}>Empty</Col>
                                <Col span={6}>Empty</Col>
                            </Row>
                        </>
                    )}

                    {users.length !== 0 &&
                        users.map((user) => (
                            <div key={user._id}>
                                <Divider />
                                <Row>
                                    <Col span={6}>{user.name}</Col>
                                    <Col span={4}>{user.phoneNumber}</Col>
                                    <Col span={4}>{user.activationKey}</Col>
                                    <Col span={4}>{user.validTill}</Col>
                                    <Col span={6}>
                                        <Button
                                            style={{ marginRight: "5px" }}
                                            onClick={() => {
                                                toggleUpdateUserModal(true);
                                                setUpdateId(user._id);
                                                setName(user.name);
                                                setPhoneNumber(
                                                    user.phoneNumber
                                                );
                                                setAddress(user.address);
                                                setValidTill(user.validTill);
                                            }}
                                        >
                                            Update
                                        </Button>
                                        <Button
                                            danger
                                            onClick={() => deleteUser(user._id)}
                                        >
                                            Delete
                                        </Button>
                                    </Col>
                                </Row>
                            </div>
                        ))}
                </div>
            </S.Container>
        </>
    );
};

export default Dashboard;
