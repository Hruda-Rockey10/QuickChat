

class Env {

    static APP_URL : string = process.env.MODE === "development" ? "http://localhost:3000" : process.env.NEXT_PUBLIC_APP_URL as string;
    static BACKEND_URL : string = process.env.MODE === "development" ? "http://localhost:8000" : process.env.NEXT_PUBLIC_BACKEND_URL as string;
}

export default Env