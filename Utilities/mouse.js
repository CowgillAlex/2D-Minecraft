const mouseState = {
    left: false,
    middle: false,
    right: false
  }
  document.addEventListener('mousedown', (event) => {
    switch (event.button){
        case 0:
            mouseState.left = true
            break
        case 1:
            mouseState.middle = true
            break
        case 2:
            mouseState.right= true
            break
        
    }
  })
  document.addEventListener('mouseup', (event) => {
    switch (event.button){
        case 0:
            mouseState.left = false
            break
        case 1:
            mouseState.middle = false
            break
        case 2:
            mouseState.right = false
            break
        
    }
  })

  export function isLeftClickDown(){
    return mouseState.left
  }
  export function isMiddleClickDown(){
    return mouseState.middle
  }
  export function isRightClickDown(){
    return mouseState.right
  }