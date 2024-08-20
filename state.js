export default class State{
    constructor(){
    this.crashed = false
}
static crash(){
    this.crashed = true
}

static getState(){
    return this.crashed
}
}