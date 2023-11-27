"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation'
import Input from '../../../../components/Input';
import Textarea from '../../../../components/Textarea';
import Select from '../../../../components/Select';
import { categoryOptions, currencyOptions, priceTypeOptions, platformOptions, levelOptions } from '../../constants';
import s from './CourseForm.module.scss';

const CourseForm = ({ initialValues, onSubmit }) => {
  const router = useRouter()
  const [course, setCourse] = useState(initialValues || {
    title: '',
    slug: '',
    description: '',
    link: '',
    category: null,
    isPaid: false,
    price: null,
    platform: null,
    author: '',
    level: null,
    certificate: false,
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    let updatedCourse;
    if (name === 'price[amount]') {
      updatedCourse = {
        ...course,
        price: { ...course.price, amount: value }
      };
    } else {
      updatedCourse = {
        ...course,
        [name]: type === 'checkbox' ? checked : value
      };
    }
    setCourse(updatedCourse);
    if (Object.keys(errors).length) {
      setErrors(validateForm(updatedCourse));
    }
  };

  const handleSelect = (name, value) => {
    let updatedCourse;
    if (name.includes('price')) {
      const parsedName = name.split('[')[1].split(']')[0];
      updatedCourse = {
        ...course,
        price: { ...course.price, [parsedName]: value }
      };
    } else {
      updatedCourse = { ...course, [name]: value };
    }
    setCourse(updatedCourse);
    if (Object.keys(errors).length) {
      setErrors(validateForm(updatedCourse));
    }
  }

  const validateForm = (courseData) => {
    let newErrors = {};

    if (!courseData.title) newErrors.title = 'Title is required.';
    if (!courseData.slug) newErrors.slug = 'URL slug is required.';
    if (!courseData.description) newErrors.description = 'Description is required.';
    if (!courseData.link) newErrors.link = 'Link is required.';
    if (!courseData.category) newErrors.category = 'Category is required.';
    if (!courseData.platform) newErrors.platform = 'Platform is required.';
    if (!courseData.level) newErrors.level = 'Level is required.';

    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newErrors = validateForm(course);
    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(error => error);
    if (hasErrors) return;

    onSubmit(course);
  }

  return (
    <form className={s.form} onSubmit={handleSubmit}>
      <div className={s.field}>
        <label htmlFor="title">Title:</label>
        <Input id="title" name="title" value={course.title} onChange={handleInputChange} />
        {errors.title && <p className={s.error}>{errors.title}</p>}
      </div>
    
      <div className={s.field}>
        <label htmlFor="slug">URL slug:</label>
        <Input name="slug" value={course.slug} onChange={handleInputChange} />
        {errors.slug && <p className={s.error}>{errors.slug}</p>}
      </div>

      <div className={s.field}>
        <label htmlFor="description">Description:</label>
        <Textarea name="description" value={course.description} onChange={handleInputChange} rows={6} />
        {errors.description && <p className={s.error}>{errors.description}</p>}
      </div>

      <div className={s.field}>
        <label htmlFor="link">Link:</label>
        <Input type="url" name="link" value={course.link} onChange={handleInputChange} />
        {errors.link && <p className={s.error}>{errors.link}</p>}
      </div>

      <div className={s.field}>
        <label htmlFor="category">Category:</label>
        <Select
          name="category"
          options={categoryOptions}
          value={categoryOptions.find(v => v.value === course.category)}
          onChange={(option) => handleSelect('category', option?.value)}
          isSearchable
          isClearable
        />
        {errors.category && <p className={s.error}>{errors.category}</p>}
      </div>

      <div className={`${s.field} ${s.fieldCheckbox}`}>
        <label htmlFor="isPaid">Paid Course:</label>
        <input type="checkbox" id="isPaid" name="isPaid" checked={course.isPaid} onChange={handleInputChange} />
      </div>

      {course.isPaid && (
        <>
          <div className={s.field}>
            <label htmlFor="currency">Currency:</label>
            <Select
              name="price[currency]"
              options={currencyOptions}
              value={currencyOptions.find(v => v.value === course.price?.currency)}
              onChange={(option) => handleSelect('price[currency]', option?.value)}
              isClearable
            />
          </div>

          <div className={s.field}>
            <label htmlFor="type">Type:</label>
            <Select
              name="price[type]"
              options={priceTypeOptions}
              value={priceTypeOptions.find(v => v.value === course.price?.type)}
              onChange={(option) => handleSelect('price[type]', option?.value)}
              isClearable
            />
          </div>

          <div className={s.field}>
            <label htmlFor="amount">Amount:</label>
            <Input type="number" name="price[amount]" value={course.price?.amount} onChange={handleInputChange} min="0" step="0.01" />
          </div>
        </>
      )}

      <div className={s.field}>
        <label htmlFor="platform">Platform:</label>
        <Select
          name="platform"
          options={platformOptions}
          value={platformOptions.find(v => v.value === course.platform)}
          onChange={(option) => handleSelect('platform', option?.value)}
          isSearchable
          isClearable
        />
        {errors.platform && <p className={s.error}>{errors.platform}</p>}
      </div>

      <div className={s.field}>
        <label htmlFor="author">Author:</label>
        <Input name="author" value={course.author} onChange={handleInputChange} required />
      </div>

      <div className={s.field}>
        <label htmlFor="level">Level:</label>
        <Select
          name="level"
          options={levelOptions}
          value={levelOptions.find(v => v.value === course.level)}
          onChange={(option) => handleSelect('level', option?.value)}
          isClearable
        />
        {errors.level && <p className={s.error}>{errors.level}</p>}
      </div>

      <div className={`${s.field} ${s.fieldCheckbox}`}>
        <label htmlFor="certificate">Certificate:</label>
        <input type="checkbox" id="certificate" name="certificate" checked={course.certificate} onChange={handleInputChange} />
      </div>

      <button className={s.submitBtn}>Submit</button>
    </form>
  )
}

export default CourseForm;