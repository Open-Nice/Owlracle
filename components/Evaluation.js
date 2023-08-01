// const [yearSemester, setYearSemester] = useState(null);
// const [instructor, setInstructor] = useState(null);

// const instructors = useMemo(() =>

//   yearSemester ? 
  
//   [...new Set(comments
//               .filter(comment => `${comment.year} ${comment.semester}` === yearSemester)
//               .map(comment => comment.instructor))]

//   :

//   [... new Set(comments.map(comment => comment.instructor))]

// , [yearSemester]);

// const yearSemesters = useMemo(() =>
  
//   instructor ?

//       [...new Set(comments
//           .filter(comment => comment.instructor === instructor)
//           .map(comment => `${comment.year} ${comment.semester}`))]

//       :

//       [... new Set(comments.map(comment => `${comment.year} ${comment.semester}`))]

// , [instructor]);

// const comment = useMemo(() =>

//   instructor && yearSemester  ? 
      
//   comments.filter(comment => comment.instructor === instructor
//                   && `${comment.year} ${comment.semester}` == yearSemester)[0]
  
//   :

//   null

// , [instructor, yearSemester]);

// const score = useMemo(() =>

//   instructor && yearSemester  ? 
      
//   scores.filter(score => score.instructor === instructor
//                   && `${score.year} ${score.semester}` == yearSemester)[0]

//   :

//   null

// , [instructor, yearSemester]);