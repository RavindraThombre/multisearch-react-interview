import { useEffect, useRef, useState } from "react";
import "./App.css";
import Pills from "./components/Pills";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestion, setSuggestion] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [selectedUserSet, setSelectedUserSet] = useState(new Set());

  //https://dummyjson.com/users/search?q=John

  const inputRefs = useRef(null);

  useEffect(() => {
    const fetchUsers = () => {
      if (searchTerm.trim === "") {
        setSuggestion([]);
        return;
      }

      fetch(`https://dummyjson.com/users/search?q=${searchTerm}`)
        .then((res) => res.json())
        .then((data) => setSuggestion(data))
        .catch((err) => {
          console.log(err);
        });
    };
    fetchUsers();
  }, [searchTerm]);

  const handleSelectedUsers = (user) => {
    setSelectedUsers([...selectedUsers, user]);
    setSelectedUserSet(new Set([...selectedUserSet, user.email]));
    setSearchTerm("");
    setSuggestion([]);
    inputRefs.current.focus();
  };

  const handleRemoveUser = (user) => {
    const updatedUsers = selectedUsers.filter(
      (selectedUsers) => selectedUsers.id !== user.id
    );
    setSelectedUsers(updatedUsers);

    const updatedEmail = new Set(selectedUserSet);
    updatedEmail.delete(user.email);
    setSelectedUserSet(updatedEmail);
  };

  const handleKeyDown = (e) => {
    if (
      e.key === "Backspace" &&
      e.target.value === "" &&
      selectedUsers.length > 0
    ) {
      const lastUser = selectedUsers[selectedUsers.length - 1];
      handleRemoveUser(lastUser);
      setSuggestion([]);
    }
  };
  // console.log(selectedUsers);
  return (
    <div>
      <div className="user-search-container">
        {/* input field with search suggestion */}

        <div className="user-search-input">
          {/* <Pills /> */}

          {selectedUsers.map((user) => {
            return (
              <Pills
                key={user.email}
                image={user.image}
                text={`${user.firstName} ${user.lastName}`}
                onClick={() => handleRemoveUser(user)}
              />
            );
          })}
          <div>
            <input
              ref={inputRefs}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for user"
              onKeyDown={handleKeyDown}
            />
            {/* search suggestion */}
            <ul className="suggestion-list">
              {suggestion?.users?.map((user, index) => {
                return !selectedUserSet.has(user.email) ? (
                  <li
                    key={user.email}
                    onClick={() => handleSelectedUsers(user)}
                  >
                    <img
                      src={user.image}
                      alt={`${user.firstName} ${user.lastName}`}
                    />
                    <span>
                      {user.firstName} {user.lastName}
                    </span>
                  </li>
                ) : (
                  <></>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
