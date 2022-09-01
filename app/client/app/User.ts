export default class User {
    public static nickname = '';
    public static inGame: string | null = null;

    public static setNickName(name: string) {
        this.nickname = name;
    }
}
