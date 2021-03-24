class BaseWidget{

  constructor(wrapperElement, initialValue){
    const thisWidget = this;

    thisWidget.dom = {};
    thisWidget.dom.wrapper = wrapperElement;

    thisWidget.correctValue = initialValue;
  }

  get value(){ // get value jest getterem czyli metodą wykonywana przyk kazdej probie odczytania właściwoxsci  value
    const thisWidget = this;

    return thisWidget.correctValue;
  }

  set value(value){ // setter - metoda wykonywana przy kazdej próbie ustawienia nowej wartosci dla właciwosci value
    const thisWidget = this;

    const newValue = thisWidget.parseValue(value);

    if(newValue !== thisWidget.correctValue && thisWidget.isValid(newValue)){
      thisWidget.correctValue = newValue;
      thisWidget.announce();
    }

    thisWidget.renderValue();
  }

  setValue(value){
    const thisWidget = this;

    thisWidget.value = value;
  }

  parseValue(value){
    return parseInt(value);
  }

  isValid(value){
    return !isNaN(value);
  }

  renderValue(){
    const thisWidget = this;

    thisWidget.dom.wrapper.innerHTML = thisWidget.value;
  }

  announce(){
    const thisWidget = this;

    const event = new CustomEvent('updated', {
      bubbles: true
    });
    thisWidget.dom.wrapper.dispatchEvent(event);
  }
}

export default BaseWidget;
