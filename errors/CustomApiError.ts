
class CustomApiError extends Error{
    constructor(message:any){
     super(message)
    }
}

export default CustomApiError