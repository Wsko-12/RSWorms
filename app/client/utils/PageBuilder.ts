type TClassProperty = string[] | string;
type TAttrProperty = { [key: string]: string | number | boolean };
type TDatasetProperty = { [key: string]: string | number };
type TContentProperty = string | (HTMLElement | string)[] | HTMLElement;

export interface ICreateElementProps {
    classes?: TClassProperty;
    id?: string;
    attrs?: TAttrProperty;
    dataset?: TDatasetProperty;
    content?: TContentProperty;
}

const prepareClassString = (str: string) => {
    return str
        .replace(/,/g, ' ')
        .replace(/\./g, ' ')
        .replace(/\s{2,}/g, ' ')
        .trim();
};

const prepareIdString = (str: string) => {
    return str
        .replace(/#/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .trim();
};

class PageBuilder {
    public static createElement<T extends HTMLElement = HTMLElement>(
        tag = 'div',
        properties: ICreateElementProps = {}
    ): T {
        const element = <T>document.createElement(tag);

        if (properties.classes) {
            this.addClassesToElement(element, properties.classes);
        }

        if (properties.attrs) {
            this.addAttrToElement(element, properties.attrs);
        }

        if (properties.dataset) {
            this.addDatasetToElement(element, properties.dataset);
        }

        if (properties.content) {
            this.addContentToElement(element, properties.content);
        }

        if (properties.id) {
            element.id = prepareIdString(properties.id);
        }

        return element;
    }

    private static addClassesToElement(element: HTMLElement, classes: TClassProperty) {
        let classesParsed: string[];
        if (typeof classes === 'string') {
            classesParsed = prepareClassString(classes).split(' ');
        } else {
            classesParsed = classes.map((item) => prepareClassString(item));
        }
        element.classList.add(...classesParsed);
    }

    private static addAttrToElement(element: HTMLElement, attributes: TAttrProperty) {
        for (const attr in attributes) {
            const value = attributes[attr];
            element.setAttribute(attr, value.toString());
        }
    }

    private static addDatasetToElement(element: HTMLElement, dataset: TDatasetProperty) {
        for (const key in dataset) {
            const value = dataset[key];
            element.dataset[key] = value.toString();
        }
    }

    private static addContentToElement(element: HTMLElement, content: TContentProperty) {
        if (typeof content === 'string') {
            element.innerHTML = content;
        } else if (content instanceof HTMLElement) {
            element.append(content);
        } else if (Array.isArray(content)) {
            content.forEach((item) => {
                if (typeof item === 'string') {
                    element.insertAdjacentHTML('beforeend', item);
                } else {
                    element.append(item);
                }
            });
        }
    }
}
export default PageBuilder;
