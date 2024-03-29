import { useRouter } from 'next/navigation'
import CourseForm from '@/components/Courses/CourseForm';
import { CourseFormValues } from '@/types/course';
import s from './Add.module.scss';

const AddCoursePage = () => {
  const router = useRouter();

  const handleSubmit = async (courseData: CourseFormValues) => {
    const { isPaid, ...rest } = courseData;
    const res = await fetch('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rest),
    });
    if (res.ok) {
      router.push('/courses');
    } else {
      const errorText = await res.text();
      console.log('Error adding course:', errorText);
      alert(errorText);
    }
  }

  return (
    <div className={s.container}>
      <h1>Add a course</h1>

      <CourseForm onSubmit={handleSubmit} />
    </div>
  )
}

export default AddCoursePage;