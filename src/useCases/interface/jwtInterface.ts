

export default interface JWT{
    createJWT(studentId: string): string,
    verifyJWT(data:any):any
}