export { default } from "next-auth/middleware";

export const config = {
    matcher: ['/playlist', '/like', '/track/upload'],
}
