var app = new Vue({
  el:'#calculator',
  data() {
    return {
      currentValue: 0,
      savedValue:false,
      currentOp: false,
    }
  },
  methods: {
    clear () {
      this.currentValue = 0
      this.savedValue = false
      this.currentOp = false
    },
    handleDigit (digit) {
      this.currentValue = this.currentValue * 10 + digit
    },
    handleOp (op){
      if (this.currentOp){
        if(this.currentOp === '+/-' && this.currentOp === '%'){
          if (this.currentOp === '+/-'){
            this.savedValue = 0 - this.currentValue
          }
          else{
            this.savedValue = this.currentValue / 100
          }
        }
        this.process()
      }
      else {
        this.savedValue = this.currentValue
      }
      this.currentValue = 0
      this.currentOp = op
    },
    process(){
        if (this.currentOp === '+') {
          this.savedValue += this.currentValue
        }
        else if (this.currentOp === '-'){
          this.savedValue -= this.currentValue
        }
        else if (this.currentOp === 'x'){
          this.savedValue *= this.currentValue
        }
        else if (this.currentOp === '/'){
          this.savedValue /= this.currentValue
        }
        else if (this.currentOp === '='){
          this.savedValue = this.currentValue
        }
        this.currentValue = 0
        this.currentOp = false
      }
  },

  computed: {
    valueDisplayed() {
      return this.savedValue ?
        this.currentValue ?
        this.currentValue : this.savedValue
        : this.currentValue
  },
}
    
    
})