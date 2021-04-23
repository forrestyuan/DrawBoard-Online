import randomString from "random-string";

class UserStore {
  username: string = `游客${randomString({
    length: 8,
    numeric: false,
    letters: true,
    special: false,
  })}`;
  isMyself(username: string) {
    return this.username === username;
  }
}

const userStore = new UserStore();
export { userStore, UserStore };
export default userStore;
