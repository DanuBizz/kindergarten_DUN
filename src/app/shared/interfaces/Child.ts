import { Kindergarden } from "./Kindergarden";

export interface Child {
    id: string;
    name: string;
    birthDate: string,
    kindergardenId: number
    signUp: Date
  }

  export interface ChildResponse {
    id: string;
    name: string;
    birthDate: string,
    signUp: Date,
    kindergarden: Kindergarden,
    kindergardenId: number
  }
