import "./SideBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faClose, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState } from "react";
import {
	collection,
	deleteDoc,
	deleteField,
	doc,
	getDoc,
	getDocs,
	onSnapshot,
	query,
	serverTimestamp,
	setDoc,
	updateDoc,
	where,
} from "firebase/firestore";
import { db } from "../../../config/firebase";
import { AuthContext } from "../../Auth/AuthContext/AuthContext";
import { ChatContext } from "../Chat/ChatContext/ChatContext";
import PropTypes from "prop-types";

SideBar.propTypes = { h_u_Select: PropTypes.func };

export default function SideBar({ h_u_Select }) {
	const [username, setUsername] = useState("");
	const [users, setUsers] = useState(null);
	const { isAuth } = useContext(AuthContext);
	const { dispatch } = useContext(ChatContext);
	const [userSelect, setUserSelect] = useState(false);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const handleSearch = async () => {
		let charr = username.replace(
			username.charAt(username.length - 1),
			String.fromCharCode(username.charCodeAt(username.length - 1) + 1)
		);

		const q = query(
			collection(db, "users"),
			// where("displayName", "==", username) // for perfect match
			where("displayName", ">=", username), // for first letter match
			where("displayName", "<=", charr)
		);

		if ("Notification" in window && Notification.permission !== "granted") {
			Notification.requestPermission();
		}

		try {
			if (!username) {
				setUsers(users);
			} else {
				const querySnapshot = await getDocs(q);
				const matchingUsers = [];
				querySnapshot.forEach((doc) => {
					matchingUsers.push(doc.data());
				});
				setUsers(matchingUsers);
			}
		} catch (error) {
			alert(error.message);
		}
	};

	const handleSelect = async (user) => {
		if (user) {
			const combinedId =
				isAuth.uid > user.uid ? isAuth.uid + user.uid : user.uid + isAuth.uid;
			try {
				const res = await getDoc(doc(db, "chats", combinedId));

				if (!res.exists()) {
					await setDoc(doc(db, "chats", combinedId), { message: [] });

					await updateDoc(doc(db, "userChats", isAuth.uid), {
						[combinedId + ".userInfo"]: {
							uid: user.uid,
							displayName: user.displayName,
							photoURL: user.photoURL,
						},
						[combinedId + [".date"]]: serverTimestamp(),
					});

					await updateDoc(doc(db, "userChats", user.uid), {
						[combinedId + ".userInfo"]: {
							uid: isAuth.uid,
							displayName: isAuth.displayName,
							photoURL: isAuth.photoURL,
						},
						[combinedId + [".date"]]: serverTimestamp(),
					});
				}
			} catch (error) {
				alert(error.message);
			}
		} else {
			alert("Please select a user");
		}
	};
	const [chats, setChats] = useState([]);

	useEffect(() => {
		const getChats = () => {
			const unsub = onSnapshot(doc(db, "userChats", isAuth.uid), (doc) => {
				setChats(doc.data());
			});
			return () => {
				unsub();
			};
		};
		isAuth.uid && getChats();
	}, [isAuth.uid]);

	const handleSelectforchat = (u) => {
		setUserSelect(!userSelect);
		h_u_Select();
		dispatch({ type: "CHANGE_USER", payload: u });
	};

	useEffect(() => {
		handleSearch();
	}, [handleSearch, username]);

	const removechatlist = async (combinedId) => {
		try {
			await deleteDoc(doc(db, "chats", combinedId));

			await updateDoc(doc(db, "userChats", isAuth.uid), {
				[combinedId]: deleteField(),
			});

			const otherUserId = combinedId.replace(isAuth.uid, "");
			await updateDoc(doc(db, "userChats", otherUserId), {
				[combinedId]: deleteField(),
			});
			window.location.reload();
		} catch (error) {
			alert("Error removing chat: " + error.message);
		}
	};

	return (
		<div className="mt-3 position-absolute top-0 start-0">
			<h2 className="text-center">Chat App</h2>
			<div className="btn-group d-flex justify-content-center mt-3 p-3">
				<input
					className="form-control shadow-none rounded-end-0"
					type="text"
					placeholder="Search"
					onChange={(e) => setUsername(e.target.value)}
				/>
				<button className="btn btn-light">
					<FontAwesomeIcon icon={faSearch} />
				</button>
			</div>
			<ul className="list-group p-1">
				{users &&
					users.map((user) => (
						<div
							key={user.uid}
							className="rounded-4 mb-2 border-3 list-group-item bg-transparent text-light d-flex justify-content-between"
						>
							<div className="d-flex">
								<img src={user.photoURL} height="30px" width="30px" alt="" />
								<div className="px-3">{user.displayName}</div>
							</div>
							<button
								key={user.uid}
								onClick={() => handleSelect(user)}
								className="btn btn-success"
							>
								<FontAwesomeIcon icon={faAdd} />
							</button>
						</div>
					))}
			</ul>
			<hr />
			<ul className="list-group p-1 chats">
				{chats &&
					!username &&
					Object.entries(chats)
						?.sort((a, b) => b[1].date - a[1].date)
						.map((chat) => (
							<div
								className="userChat btn rounded-4 mb-2 border-3 list-group-item bg-transparent text-light d-flex justify-content-between"
								key={chat[0]}
								onClick={() => handleSelectforchat(chat[1].userInfo)}
							>
								<div className="d-flex align-items-center justify-content-start">
									<img
										src={chat[1].userInfo.photoURL}
										height="30px"
										width="30px"
										alt=""
									/>
									<div className="userChatInfo">
										<div className="px-3">{chat[1].userInfo.displayName}</div>
									</div>
									{/* <div className="userChatInfo">
                    <div className="px-3">{chat[1].lastMessage?.text}</div>
                  </div> */}
								</div>
								<div className="userChatInfo d-flex justify-content-end">
									<button
										className="btn btn-danger"
										onClick={(e) => {
											e.stopPropagation();
											removechatlist(chat[0]);
										}}
									>
										<FontAwesomeIcon icon={faClose} />
									</button>
								</div>
							</div>
						))}
			</ul>
		</div>
	);
}
