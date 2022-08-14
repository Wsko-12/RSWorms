import './test.scss';

export default class Test {
    test() {
        const div = document.createElement('div');
        div.classList.add('test');
        document.body.append(div);
    }
}
