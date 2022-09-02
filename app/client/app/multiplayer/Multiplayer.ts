import PageBuilder from '../../utils/PageBuilder';
import User from '../User';
import './style.scss';
export default class Multiplayer {
    private static getStartScreen(id: string) {
        const element = PageBuilder.createElement('section', {
            classes: 'lobby__screen multiplayer__overlay',
        });

        const title = PageBuilder.createElement('p', {
            classes: 'multiplayer__title',
            content: `Starting game: ${id}`,
        });

        element.append(title);

        return element;
    }

    static showStartGameScreen(id: string) {
        document.body.innerHTML = '';
        User.inRoom = null;
        User.inGame = id;
        document.body.append(this.getStartScreen(id));
    }
}
