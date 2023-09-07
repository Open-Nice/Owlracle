import { chillEx } from '@/app/experts/chill'
import { courseEx } from '@/app/experts/course'
import { clubEx } from '@/app/experts/club'
import { eventEx } from '@/app/experts/event'
import { facultyEx } from '@/app/experts/faculty'
import { careerEx } from '@/app/experts/career'
import { academicPlanEx } from '@/app/experts/academicPlan'
import { programEx } from '@/app/experts/program'

interface expertInfo {
    expert_name: string;
    expert_description: string;
    expert_function?: (prompt: string, dbs: number[], specificity: number) => Promise<Response>;
}

export const expertsInfo: { [key: number]: expertInfo } = {
    1: { 
        expert_name: 'Everyday conversation expert', 
        expert_description: 'good at normal conversation and doesn\'t accept any knowledge database.', 
        expert_function: chillEx 
    },
    // 2: , 
    3: { 
        expert_name: 'Course expert', 
        expert_description: 'answer questions or recommend courses.', 
        expert_function: courseEx 
    },
    4: { 
        expert_name: 'Event expert', 
        expert_description: 'answer questions or recommend recent school events.', 
        expert_function: eventEx 
    },
    5: { 
        expert_name: 'Club expert', 
        expert_description: 'answer questions or recommend school clubs.', 
        expert_function: clubEx 
    },
    6: { 
        expert_name: 'Faculty expert', 
        expert_description: 'answer questions or recommend faculty.', 
        expert_function: facultyEx 
    },
    // 7: ,
    8: { 
        expert_name: 'Career expert', 
        expert_description: 'answer questions or recommend resources for career in industry or PHD.', 
        expert_function: careerEx 
    },
    9: { 
        expert_name: 'Academic planner', 
        expert_description: 'help students plan their major, e.g. what courses to take in each semester.', 
        expert_function: academicPlanEx 
    },
    10: { 
        expert_name: 'Resource recommender', 
        expert_description: 'Recommend programs inside Rice University to help students.', 
        expert_function: programEx 
    },
}
