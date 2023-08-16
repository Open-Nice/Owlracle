interface dbInfo {
    db_dependency: number;
    db_rpc: string;
    db_name: string;
    db_description: string;
}

export const dbsInfo: { [key: number]: dbInfo } = {
    1: {
      db_dependency: 11,
      db_rpc: 'match_courses',
      db_name: 'Courses',
      db_description: "course name, credit hour, department, description, grade_mode. Don't contain any faculty who taught the class before.",
    },
    2: {
      db_dependency: 1,
      db_rpc: 'match_open_courses',
      db_name: 'Course open status',
      db_description: 'which courses open in the upcoming semester'
    },
    3: {
      db_dependency: 5,
      db_rpc: 'match_eval_comments',
      db_name: 'Course evaluation comments',
      db_description: "students' comments on course and instructor. Contain which course the faculty taught before."
    },
    4: {
      db_dependency: 10,
      db_rpc: 'match_eval_scores',
      db_name: 'Course evaluation scores',
      db_description: "students' scores on course and instructor e.g. course workload, quality and difficulty. Contain which course the faculty taught before."
    },
    5: {
      db_dependency: 12,
      db_rpc: 'match_faculties',
      db_name: 'Faculties',
      db_description: "faculty research background. It doesn't tell any information about course the faculty is teaching."
    },
    // 6: {
    //   db_dependency: 6,
    //   db_rpc: '', // RPC for Notes is missing
    //   db_name: 'Notes',
    //   db_description: 'urls that points to lecture notes'
    // },
    7: {
      db_dependency: 8,
      db_rpc: 'match_events',
      db_name: 'Events',
      db_description: 'recent school events'
    },
    8: {
      db_dependency: 9,
      db_rpc: 'match_organizations',
      db_name: 'Clubs',
      db_description: 'school clubs and their description'
    },
    9: {
      db_dependency: 7,
      db_rpc: 'match_careers',
      db_name: 'Career',
      db_description: 'industry and PHD career resources for each different majors'
    },
    10: {
      db_dependency: 2,
      db_rpc: 'match_academic_resources',
      db_name: 'Academic resources',
      db_description: 'rice internal resources to support each major'
    },
    11: {
      db_dependency: 3,
      db_rpc: 'match_course_roadmap',
      db_name: 'Course roadmap',
      db_description: 'what courses to take for each semester for different majors'
    },
    12: {
      db_dependency: 4,
      db_rpc: 'match_program_resources',
      db_name: 'Program resources',
      db_description: 'unique programs to boost student growth, such as leadership development'
    },
    // 13: {
    //   db_dependency: 13,
    //   db_rpc: '', // RPC for Major requirements is missing
    //   db_name: 'Major requirements',
    //   db_description: 'what courses are needed to complete a specific major degree'
    // }
}
