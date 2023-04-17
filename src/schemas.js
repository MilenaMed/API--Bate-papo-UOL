import Joi from "joi"


//Joi
const participantes = Joi.object({
    name: Joi.string().min(1).required(),
});

const mensagem = Joi.object({
    to: Joi.string().required(),
    text: Joi.string().required(),
    type: Joi.string().valid("message", "private_message").required(),
});

export {participantes, mensagem}