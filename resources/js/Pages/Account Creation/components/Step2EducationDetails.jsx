import { useState, useEffect, useMemo, useRef } from "react";
import axios from "axios";
import styles from '../register.module.scss';

function debounce(func, delay) {
  let timer;
  return (...args) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}
const highlightMatch = (text, query) => {
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return (
    <>
      {parts.map((part, i) => (
        <span
          key={i}
          className={part.toLowerCase() === query.toLowerCase() ? "font-bold text-yellow-600" : ""}
        >
          {part}
        </span>
      ))}
    </>
  );
};
const Step2EducationDetails = ({
  formData,
  handleInputChange,
  handleSubmit,
  setErrorMessage,
}) => {
  const [localError, setLocalError] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [schoolQuery, setSchoolQuery] = useState("");
  const [courses, setCourses] = useState([]);
  const [allSchools, setAllSchools] = useState([]);
  const [isUniversityValid, setIsUniversityValid] = useState(true);
  const [hasSelectedUniversity, setHasSelectedUniversity] = useState(false);

  const dropdownRef = useRef(null);
  
  // Fetch courses from database on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('/api/courses');
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses", error);
      }
    };
    
    fetchCourses();
  }, []);

  // Fetch all schools for validation
  useEffect(() => {
    const fetchAllSchools = async () => {
      try {
        const response = await axios.get('/schools/search', {
          params: { query: '' }
        });
        setAllSchools(response.data);
      } catch (error) {
        console.error("Error fetching all schools", error);
      }
    };
    
    fetchAllSchools();
  }, []);

  // Initialize hasSelectedUniversity based on current form data
  useEffect(() => {
    if (formData.university && formData.island && formData.region) {
      const isValidSchool = allSchools.some(school => 
        school.name.toLowerCase() === formData.university.toLowerCase()
      );
      if (isValidSchool) {
        setHasSelectedUniversity(true);
        setSchoolQuery(formData.university);
      }
    }
  }, [formData.university, formData.island, formData.region, allSchools]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        //setFilteredSchools([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const cache = useRef({});
  const debouncedSearch = useMemo(() =>
    debounce(async (value) => {
      if (cache.current[value]) {
        setFilteredSchools(cache.current[value]);
        return;
      }
      try {
        const response = await axios.get("/schools/search", {
          params: { query: value }
        });
        cache.current[value] = response.data;
        setFilteredSchools(response.data);
      } catch (error) {
        console.error("Error fetching schools", error);
      }
    }, 300), []
  );

  const handleUniversityChange = (e) => {
    const { value } = e.target;
    
    // If user has previously selected a university and starts typing, clear everything
    if (hasSelectedUniversity && value !== formData.university) {
      // Clear all related fields
      handleInputChange({ target: { name: "university", value: "" } });
      handleInputChange({ target: { name: "island", value: "" } });
      handleInputChange({ target: { name: "region", value: "" } });
      setHasSelectedUniversity(false);
      setIsUniversityValid(true);
      setFilteredSchools([]);
      setSchoolQuery("");
      return;
    }
    
    handleInputChange(e);
    setSchoolQuery(value);
    
    if (value.trim() === "") {
      setFilteredSchools([]);
      setIsUniversityValid(true);
      setHasSelectedUniversity(false);
      return;
    }
    
    debouncedSearch(value);
    
    // Check if the current value matches any school in allSchools
    const isValidSchool = allSchools.some(school => 
      school.name.toLowerCase() === value.toLowerCase()
    );
    setIsUniversityValid(isValidSchool);
  };
  const handleUniversitySelect = (school) => {
    handleInputChange({ target: { name: "university", value: school.name } });
    handleInputChange({ target: { name: "island", value: school.island } });
    handleInputChange({ target: { name: "region", value: school.region } });
    setFilteredSchools([]);
    setIsUniversityValid(true);
    setHasSelectedUniversity(true);
    setSchoolQuery(school.name);
  };

  const handleCourseChange = (e) => {
    const { value } = e.target;
    handleInputChange(e); // update university

    const filtered = courses.filter(
      (course) =>
        course.program &&
        course.program.toLowerCase().includes(value.toLowerCase())
    ).sort((a, b) => a.program.localeCompare(b.program));

    setFilteredCourses(filtered);

  };
  const handleCourseSelect = (course) => {
    handleInputChange({ target: { name: "course", value: course.program } });
    setFilteredCourses([]);
  };

  const handleAnyInputChange = (e) => {
    handleInputChange(e);
    if (localError) {
      if (validateForm()) {
        setLocalError('');
        if (setErrorMessage) setErrorMessage('');
      }
    }
  };

  const validateForm = () => {
    const requiredFields = [
      "yearLevel",
      "university",
      "island",
      "region",
      "studentId",
      "course",
      "proofOfEnrollment",
    ];
    for (let field of requiredFields) {
      if (
        !formData[field] ||
        (field !== "proofOfEnrollment" && formData[field].toString().trim() === "")
      ) {
        setLocalError("⚠️ Please fill in all the required fields.");
        return false;
      }
    }

    // Validate university against valid schools
    if (formData.university && formData.university.trim() !== "") {
      const isValidSchool = allSchools.some(school => 
        school.name.toLowerCase() === formData.university.toLowerCase()
      );
      if (!isValidSchool) {
        setLocalError("⚠️ Please select a valid university from the dropdown list.");
        setIsUniversityValid(false);
        return false;
      }
    }

    const file = formData.proofOfEnrollment;
    if (file) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/jpg",
        "application/pdf",
      ];
      if (!allowedTypes.includes(file.type)) {
        setLocalError("⚠️ File must be an image (jpg, jpeg, png) or PDF.");
        return false;
      }
    } else {
      setLocalError("⚠️ Please upload your proof of enrollment.");
      return false;
    }
    setLocalError("");
    return true;
  };

  const handleAnyInputBlur = () => {
  validateForm();
};

  return ( 
  <div className="">
  <h1 className={`${styles['title-register']} text-white mb-2 text-2xl md:text-[2.5rem]`}>
      CREATE MSL ACCOUNT
  </h1>
  <h2 className={`${styles['subtitle-register']} text-white`}>
      SCHOOL DETAILS
  </h2>

  {/* Dynamic Progress Bar for Step 2 */}
  {(() => {
    const requiredFields = [
      "yearLevel",
      "university",
      "island",
      "region",
      "studentId",
      "course",
      "proofOfEnrollment",
    ];
    const filled = requiredFields.filter(
      (field) => formData[field] && formData[field].toString().trim() !== ""
    ).length;
    const percent = 26 + Math.round((filled / requiredFields.length) * (50 - 26));

    return (
      <div className="my-4 px-1">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
          <div
            className="h-full bg-yellow-500 transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="text-xs text-gray-100 text-right">
          Step 2 of 4 &mdash; {percent}% of this step complete
        </div>
      </div>
    );
  })()}

<div className="space-y-6">
  <div className="flex flex-col md:flex-row gap-4">
    <div className="flex-1">
      <label htmlFor="yearLevel" className="text-white block mb-1">
        Year Level<span className="text-red-500"> *</span>
      </label>
      <select
        id="yearLevel"
        name="yearLevel"
        value={formData.yearLevel}
        onChange={handleAnyInputChange}
        onBlur={handleAnyInputBlur}
        className={`${styles['input-field-register']} w-full p-3 text-white border border-gray-700 bg-gray-900 bg-opacity-70 rounded-lg text-base placeholder-gray-500 focus:outline-none focus:border-yellow-400`}
        required
      >
        <option value="" disabled>Select Year Level</option>
        <option value="Grade 11">Grade 11</option>
        <option value="Grade 12">Grade 12</option>
        <option value="Freshmen">Freshmen</option>
        <option value="Sophomore">Sophomore</option>
        <option value="Junior">Junior</option>
        <option value="Senior">Senior</option>
        <option value="Alumni">Alumni</option>
        <option value="Masters">Masters</option>
        <option value="Doctorate">Doctorate</option>
      </select>
    </div>

    <div className="flex-1 relative">
        <label htmlFor="university" className="text-white block mb-1">
          University / College / Institute<span className="text-red-500"> *</span>
        </label>
        <input
          type="text"
          id="university"
          name="university"
          value={formData.university}
          onChange={handleUniversityChange}
          onBlur={handleAnyInputBlur}
          className={`${styles['input-field-register']} w-full p-3 text-white border ${
            !isUniversityValid && formData.university ? 'border-red-500' : 'border-gray-700'
          } bg-gray-900 bg-opacity-70 rounded-lg text-base placeholder-gray-500 focus:outline-none focus:border-yellow-400`}
          placeholder="e.g. University of XYZ"
          required
          autoComplete="off"
        />
        {!isUniversityValid && formData.university && (
          <p className="text-red-400 text-sm mt-1">
            Please select a valid university from the dropdown list.
          </p>
        )}

        {filteredSchools.length > 0 && (
          <ul
            ref={dropdownRef}
            className="absolute z-10 w-full bg-white text-black border border-gray-300 rounded-md shadow-md mt-1 max-h-60 overflow-y-auto"
          >
            {filteredSchools.map((school) => (
              <li
                key={school.id}
                onMouseDown={() => handleUniversitySelect(school)}
                className="px-4 py-2 cursor-pointer hover:bg-yellow-100"
              >
                <p className="font-medium">{highlightMatch(school.name, schoolQuery)}</p>
                <p className="text-sm text-gray-600">
                  {school.island} • {school.region}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>

  <div className="flex flex-col md:flex-row gap-4">
    <div className="flex-1">
      <label htmlFor="island" className="text-white block mb-1">
        Island<span className="text-red-500"> *</span>
      </label>
      <input
        type="text"
        id="island"
        name="island"
        value={formData.island}
        onChange={handleAnyInputChange}
        onBlur={handleAnyInputBlur}
        className={`${styles['input-field-register']} w-full p-3 text-white border border-gray-700 bg-gray-900 bg-opacity-70 rounded-lg text-base focus:outline-none focus:border-yellow-400`}
        readOnly
      />
    </div>
    <div className="flex-1">
      <label htmlFor="region" className="text-white block mb-1">
        Region<span className="text-red-500"> *</span>
      </label>
      <input
        type="text"
        id="region"
        name="region"
        value={formData.region}
        className={`${styles['input-field-register']} w-full p-3 text-white border border-gray-700 bg-gray-900 bg-opacity-70 rounded-lg text-base focus:outline-none focus:border-yellow-400`}
        readOnly
      />
    </div>
  </div>

  <div className="flex flex-col md:flex-row gap-4">
    <div className="flex-1">
      <label htmlFor="studentId" className="text-white block mb-1">
        Student ID<span className="text-red-500"> *</span>
      </label>
      <input
        type="text"
        id="studentId"
        name="studentId"
        value={formData.studentId}
        onChange={handleAnyInputChange}
        onBlur={handleAnyInputBlur}
        className={`${styles['input-field-register']} w-full p-3 text-white border border-gray-700 bg-gray-900 bg-opacity-70 rounded-lg text-base placeholder-gray-500 focus:outline-none focus:border-yellow-400`}
        placeholder="e.g. 12345678"
        required
      />
    </div>

    <div className="flex-1 relative">
        <label htmlFor="course" className="text-white block mb-1">
          Course or Program<span className="text-red-500"> *</span>
        </label>
        <input
          id="course"
          name="course"
          value={formData.course}
          onChange={handleCourseChange}
          onBlur={handleAnyInputBlur}
          className={`${styles['input-field-register']} w-full p-3 text-white border border-gray-700 bg-gray-900 bg-opacity-70 rounded-lg text-base placeholder-gray-500 focus:outline-none focus:border-yellow-400`}
          required
        />
        {filteredCourses.length > 0 && (
          <ul className="absolute z-10 w-full bg-white text-black border border-gray-300 rounded-md shadow-md mt-1 max-h-60 overflow-y-auto">
            {filteredCourses.map((course, i) => (
              <li
                key={i}
                onMouseDown={() => handleCourseSelect(course)}
                className="px-4 py-2 cursor-pointer hover:bg-yellow-100"
              >
                <p className="font-medium">{course.program}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

  </div>

  <div>
    <label htmlFor="proofOfEnrollment" className="text-white block mb-1">
      Proof of Enrolment / School ID with Validation<span className="text-red-500"> *</span>
    </label>
    <input
      type="file"
      id="proofOfEnrollment"
      name="proofOfEnrollment"
      onChange={handleAnyInputChange}
      onBlur={handleAnyInputBlur}
      className={`${styles['input-field-register']} w-full text-white border border-gray-700 bg-gray-900 bg-opacity-70 rounded-lg text-base p-3 cursor-pointer file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-md file:bg-yellow-400 file:text-black hover:file:bg-yellow-300 focus:outline-none focus:border-yellow-400`}
      accept=".jpg,.jpeg,.png,.pdf"
      required
    />
  </div>

</div>

</div>
  );
};

export default Step2EducationDetails;
