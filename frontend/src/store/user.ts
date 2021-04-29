import randomString from "random-string";

class UserStore {
  static username: string = `游客${randomString({
    length: 8,
    numeric: false,
    letters: true,
    special: false,
  })}`;
  static isMyself(username: string) {
    return UserStore.username === username;
  }
}

export { UserStore };
export default UserStore;
