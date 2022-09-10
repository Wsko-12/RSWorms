import PageBuilder from '../../../utils/PageBuilder';
import App from '../../App';
import User from '../../User';
import './style.scss';
export default class MultiplayerInterface {
    private static startScreen = this.getStartScreen();
    private static waitingPlayersScreen = this.getWaitingPlayersScreen();

    private static getStartScreen() {
        const element = PageBuilder.createElement('section', {
            classes: 'lobby__screen multiplayer__overlay',
        });

        const title = PageBuilder.createElement('p', {
            classes: 'multiplayer__title',
            content: `Starting game: `,
        });

        element.append(title);

        return {
            element,
            show(flag: boolean, id?: string) {
                if (flag) {
                    if (id) {
                        title.innerHTML = `Starting game: ${id}`;
                    }
                    App.screen.append(element);
                } else {
                    element.remove();
                }
            },
        };
    }

    private static getWaitingPlayersScreen() {
        const element = PageBuilder.createElement('section', {
            classes: 'lobby__screen waiting-players__overlay',
        });

        const title = PageBuilder.createElement('p', {
            classes: 'multiplayer__title',
            content: `Waiting for other players...`,
        });

        element.append(title);

        return {
            element,
            show(flag: boolean) {
                if (flag) {
                    App.screen.append(element);
                } else {
                    element.remove();
                }
            },
        };
    }

    static showStartGameScreen(id: string) {
        App.screen.innerHTML = '';
        User.inRoom = null;
        User.inGame = id;
        this.startScreen.show(true, id);
    }

    static showWaitingPlayersScreen(flag: boolean) {
        this.waitingPlayersScreen.show(flag);
    }
}
