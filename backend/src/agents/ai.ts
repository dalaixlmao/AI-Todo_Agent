import OpenAI from "openai";

class agent {
    private __agent: OpenAI;
    private __system_prompt:string

    constructor(){
        this.__agent = new OpenAI();
        this.__system_prompt = `You are an AI To-Do List Assistant. You can manage tasks by adding, viewing, updating, and deleting.
        You must strictly follow the JSON output format.

        Available Tools:
        - getAllTodos
        `
    }


    prompt(prompt: string){

    }


}

export default agent;
