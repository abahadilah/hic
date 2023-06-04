class Canons {
  static Sūryasiddhānta = new Canons(0);
  static SūryasiddhāntaOld = new Canons(1);
  static Āryasiddhānta = new Canons(2);

  static toString(value) {
    if (value == this.Sūryasiddhānta.value) {
      return "Sūryasiddhānta"
    }
    else 
    if (value == this.SūryasiddhāntaOld.value) {
      return "Sūryasiddhānta (Old)"
    }
    else {
      return "Āryasiddhānta"
    }
  }

  constructor(value) {
    this.value = value;
  }
}


export default Canons;