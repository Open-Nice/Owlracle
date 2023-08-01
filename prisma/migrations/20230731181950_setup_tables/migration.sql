-- CreateTable
CREATE TABLE "CourseCatalog" (
    "course_name" VARCHAR(255) NOT NULL,
    "course_credit" VARCHAR(255) NOT NULL,
    "distribution" VARCHAR(255) NOT NULL,
    "course_long_title" TEXT NOT NULL,
    "course_department" VARCHAR(255) NOT NULL,
    "grade_mode" VARCHAR(255) NOT NULL,
    "language_instruction" VARCHAR(255) NOT NULL,
    "course_type" VARCHAR(255) NOT NULL,
    "cField" VARCHAR(255) NOT NULL,
    "cNum" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "CourseCatalog_pkey" PRIMARY KEY ("cField","cNum")
);

-- CreateTable
CREATE TABLE "CourseComments" (
    "id" SERIAL NOT NULL,
    "cField" VARCHAR(255) NOT NULL,
    "cNum" VARCHAR(255) NOT NULL,
    "year" VARCHAR(255) NOT NULL,
    "semester" VARCHAR(255) NOT NULL,
    "crn" VARCHAR(255) NOT NULL,
    "name" TEXT NOT NULL,
    "instructor" VARCHAR(255) NOT NULL,
    "comments" TEXT[],
    "instructor_comments" JSONB[],

    CONSTRAINT "CourseComments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseScores" (
    "id" SERIAL NOT NULL,
    "cField" VARCHAR(255) NOT NULL,
    "cNum" VARCHAR(255) NOT NULL,
    "year" VARCHAR(255) NOT NULL,
    "semester" VARCHAR(255) NOT NULL,
    "crn" VARCHAR(255) NOT NULL,
    "name" TEXT NOT NULL,
    "instructor" VARCHAR(255) NOT NULL,
    "organization" JSONB NOT NULL,
    "assignment" JSONB NOT NULL,
    "overall_quality" JSONB NOT NULL,
    "challenge" JSONB NOT NULL,
    "workload" JSONB NOT NULL,
    "why_take_this_course" JSONB NOT NULL,
    "expected_grade" JSONB NOT NULL,
    "expectedPF" JSONB NOT NULL,
    "instructor_evaluations" JSONB[],

    CONSTRAINT "CourseScores_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CourseComments" ADD CONSTRAINT "CourseComments_cField_cNum_fkey" FOREIGN KEY ("cField", "cNum") REFERENCES "CourseCatalog"("cField", "cNum") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseScores" ADD CONSTRAINT "CourseScores_cField_cNum_fkey" FOREIGN KEY ("cField", "cNum") REFERENCES "CourseCatalog"("cField", "cNum") ON DELETE RESTRICT ON UPDATE CASCADE;
