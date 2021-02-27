import { Request, Response } from "express";    
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailService";
import { resolve } from "path";

class SendMailController {

    async execute(request: Request, response: Response){
        const { email, survey_id } = request.body;
        
        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);
        
        const userAlreadyExists = await usersRepository.findOne({email});

        if(!userAlreadyExists) {
            return response.status(400).json({
                error: "The User doesn't exists!"
            });
        };

        const survey = await surveysRepository.findOne({id: survey_id});

        if(!survey) {
            return response.status(400).json({
                error: "The Survey doesn't exists!"
            });
        };

        const variables = {
            name: userAlreadyExists.name,
            title: survey.title,
            description: survey.description,
            user_id: userAlreadyExists.id,
            link: process.env.URL_MAIL
        }

        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

        const surveyUserAlreadyExists = await   surveysUsersRepository.findOne({
            where: [{user_id: userAlreadyExists.id}, {value: null}],
            relations: ["user", "survey"]
        });

        if(surveyUserAlreadyExists) {
            await SendMailService.execute(email, survey.title, variables, npsPath);
            return response.json(surveyUserAlreadyExists);
        }



        const surveyUser = surveysUsersRepository.create({
            user_id: userAlreadyExists.id,
            survey_id,
        })

    
        await surveysUsersRepository.save(surveyUser);

        await SendMailService.execute(email, survey.title, variables, npsPath);

        return response.json(surveyUser);
    }
}

export { SendMailController }; 