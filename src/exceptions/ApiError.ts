class ApiError extends Error {
        status: number;
        errors?: Array<Error>;

        public constructor(status:number,message:string,errors?:Array<Error>) {
            super(message)
            this.status = status
            this.errors = errors
        }

        static UnauthorizedError(): ApiError {
            return new ApiError(401,"User doesn't authtorize")
        }

        static BadRequest(message: string,errors = []) : ApiError {
            return new ApiError(400,message,errors)
        }
}

export default ApiError