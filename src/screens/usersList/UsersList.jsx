import React, { useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../../services/api/user/index";
import MainTable from "../../components/tables/MainTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBan,
  faCheck,
  faPenToSquare,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import MainAlert from "../../components/alerts/mainAlert";
import Modal from "../../components/modals/modalEditUser";
import MainInput from "../../components/inputs/mainInput";

const UsersList = () => {
  const [usersList, setUsersList] = useState(null);
  const [user, setUser] = useState(null);

  const [isLoadingEdit, setIsLoadingEdit] = useState(null);

  const [msgAlert, setMsgAlert] = useState(false);
  const [msgText, setMsgText] = useState("");
  const [msgTitle, setMsgTitle] = useState("");
  const [msgType, setMsgType] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const hasFetched = useRef(false);

  const columns = [
    { label: "Nome", field: "firstName" },
    { label: "SobreNome", field: "lastName" },
    { label: "Email", field: "email" },
    { label: "Ativo", field: "activated" },
    {
      label: "Ações",
      field: "actions",
      type: "buttons",
      buttons: [
        {
          icon: <FontAwesomeIcon icon={faPenToSquare} className="text-white" />,
          onClick: (item) => handleEdit(item),
          colorButton: "bg-yellow-500",
        },
        {
          icon: <FontAwesomeIcon icon={faTrashCan} className="text-white" />,
          onClick: (item) => handleDelete(item.id),
          colorButton: "bg-violet-500",
        },
        {
          name: "ban",
          icon: <FontAwesomeIcon icon={faBan} className="text-white" />,
          onClick: (item) => handleEditActive(item.id, false),
          colorButton: "bg-red-500",
        },
        {
          name: "check",
          icon: <FontAwesomeIcon icon={faCheck} className="text-white" />,
          onClick: (item) => handleEditActive(item.id, true),
          colorButton: "bg-green-500",
        },
      ],
    },
  ];

  const handleCheckToken = () => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);

      getAllUsers(decoded.id);
    }
  };

  const getAllUsers = (id) => {
    api.allUsers().then((res) => {
      // console.log(res.status, res.data);
      if (res.status === 200) {
        const filteredUsers = res.data.users.filter((user) => user.id !== id);
        setUsersList(filteredUsers);
      }
    });
  };

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      handleCheckToken();
    }
  }, []);

  const handleDelete = (item) => {
    api.deleteUser(item).then((res) => {
      if (res.status === 200) {
        getAllUsers(user.id);
      } else {
        setMsgType("error");
        setMsgTitle("Erro");
        setMsgText("Erro de conexão, tente novamente mais tarde.");
        setMsgAlert(true);

        setTimeout(() => {
          setMsgAlert(false);
        }, 3000);
      }
    });
  };

  const handleEdit = (item) => {
    console.log(item);
    setSelectedUser(item);
    setName(item.firstName);
    setLastName(item.lastName);
    setEmail(item.email);

    setIsModalOpen(true);
  };

  const handleSaveEdit = () => {
    setIsLoadingEdit(true);
    console.log(selectedUser);

    api.editUser(selectedUser.id, name, lastName, email).then((res) => {
      if (res.status === 200) {
        getAllUsers(user.id);
        setIsLoadingEdit(false);
        setIsModalOpen(false);

        setSelectedUser(null);
        setName("");
        setLastName("");
        setEmail("");
      } else {
        setIsLoadingEdit(false);
        setIsModalOpen(false);

        setSelectedUser(null);
        setName("");
        setLastName("");
        setEmail("");

        setMsgType("error");
        setMsgTitle("Erro");
        setMsgText("Erro de conexão, tente novamente mais tarde.");
        setMsgAlert(true);

        setTimeout(() => {
          setMsgAlert(false);
        }, 3000);
      }
    });
  };

  const handleEditActive = (item, e) => {
    console.log(item, e);
    api.editActivatedUser(item, e).then((res) => {
      console.log(res.status, res.data);
      if (res.status === 200) {
        getAllUsers(user.id);
      } else {
        setMsgType("error");
        setMsgTitle("Erro");
        setMsgText("Erro de conexão, tente novamente mais tarde.");
        setMsgAlert(true);

        setTimeout(() => {
          setMsgAlert(false);
        }, 3000);
      }
    });
  };

  return (
    <div className="bg-gray-50 h-full px-6 py-10">
      <div className="bg-white rounded-xl shadow-[0_2px_4px_rgba(0,0,0,0.1)] w-full p-4">
        <h2 className="text-gray-500 text-xl font-bold pb-2 border-b-3 border-gray-200">
          Usuários
        </h2>

        {msgAlert && (
          <MainAlert type={msgType} message={msgText} title={msgTitle} />
        )}

        <MainTable columns={columns} data={usersList} itemsPerPage={8} />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Editar Usuário"
        classCard={"!max-w-xl"}
        isLoading={isLoadingEdit}
        handleSaveEdit={handleSaveEdit}
      >
        <div className="flex flex-row gap-4">
          <MainInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            type={"text"}
            placeholder={"Nome"}
            classInput={"w-full h-10 !border-gray-400"}
            classDiv={"w-full mt-6 flex items-center"}
            classLabel={"w-full ps-2"}
            label={"Nome"}
            id={"nome"}
          />

          <MainInput
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            type={"text"}
            placeholder={"Sobrenome"}
            classInput={"w-full h-10 !border-gray-400"}
            classDiv={"w-full mt-6 flex items-center"}
            classLabel={"w-full ps-2"}
            label={"Sobrenome"}
            id={"sobrenome"}
          />
        </div>

        <MainInput
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type={"text"}
          placeholder={"Email"}
          classInput={"w-full h-10 !border-gray-400"}
          classDiv={"w-full mt-4 flex items-center"}
          classLabel={"w-full ps-2"}
          label={"Email"}
          id={"email"}
        />
      </Modal>
    </div>
  );
};

export default UsersList;
