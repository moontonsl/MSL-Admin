import { useState, useEffect, useMemo, useRef } from "react";
import courses from "../../../../../public/json/courses.json";
import axios from "axios";

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

  const dropdownRef = useRef(null);
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
    handleInputChange(e);

    setSchoolQuery(value);
    if (value.trim() === "") {
      setFilteredSchools([]);
      return;
    }
    debouncedSearch(value);
  };
  const handleUniversitySelect = (school) => {
    handleInputChange({ target: { name: "university", value: school.name } });
    handleInputChange({ target: { name: "island", value: school.island } });
    handleInputChange({ target: { name: "region", value: school.region } });
    setFilteredSchools([]);
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
      <h1 className="title-register">CREATE MSL ACCOUNT</h1>
      <h2 className="subtitle-register">SCHOOL DETAILS</h2>

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
          <div style={{ margin: "16px 0" }}>
            <div style={{ height: "12px", background: "#eee", borderRadius: "6px", overflow: "hidden", marginBottom: "4px" }}>
              <div style={{ width: `${percent}%`, height: "100%", background: "#f1c40f", transition: "width 0.3s" }} />
            </div>
            <div style={{ fontSize: "12px", color: "#555" }}>
              Step 2 of 4 &mdash; {percent}% of this step complete
            </div>
          </div>
        );
      })()}

      <div className="form-register">
        <div className="form-row-register">
          <div className="input-group-register left-side-register">
            <label htmlFor="yearLevel" className="label-register">
              Year Level<span className="required"> *</span>
            </label>
            <select id="yearLevel" name="yearLevel" value={formData.yearLevel} onChange={handleAnyInputChange} onBlur={handleAnyInputBlur} className="input-field-register year-level-select" required >
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
          <div className="input-group-register right-side-register relative">
            <label htmlFor="university" className="label-register">
              University / College / Institute<span className="required"> *</span>
            </label>

            <input
              type="text"
              id="university"
              name="university"
              value={formData.university}
              onChange={handleUniversityChange}
              onBlur={handleAnyInputBlur}
              className="input-field-register"
              placeholder="e.g. University of XYZ"
              required
              autoComplete="off"
            />
            {/* dito dropdown university */}
            {filteredSchools.length > 0 && (
              <ul
                ref={dropdownRef}
                className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-md mt-1 max-h-60 overflow-y-auto"
              >
                {filteredSchools.map((school) => (
                  <li
                    key={school.id}
                    onMouseDown={() => handleUniversitySelect(school)}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    <p>{highlightMatch(school.name, schoolQuery)}</p>
                    <p className="text-sm text-gray-500">
                      {school.island} • {school.region}
                    </p>
                  </li>
                ))}
              </ul>
            )}

          </div>
        </div>
        <div className="form-row-register">
          <div className="input-group-register left-side-register">
            <label htmlFor="island" className="label-register">
              Island<span className="required"> *</span>
            </label>

            <input
              type="text"
              id="island"
              name="island"
              value={formData.island}
              onChange={handleAnyInputChange}
              onBlur={handleAnyInputBlur}
              className="input-field-register"
              readOnly
            />

          </div>
          <div className="input-group-register right-side-register">
            <label htmlFor="region" className="label-register">
              Region<span className="required"> *</span>
            </label>
            <input type="text" id="region" name="region" value={formData.region} className="input-field-register" readOnly />
          </div>
        </div>
        <div className="form-row-register">
          <div className="input-group-register left-side-register">
            <label htmlFor="studentId" className="label-register">
              Student ID<span className="required"> *</span>
            </label>
            <input type="text" id="studentId" name="studentId" value={formData.studentId} onChange={handleAnyInputChange} onBlur={handleAnyInputBlur} className="input-field-register" placeholder="e.g. 12345678" required />
          </div>
          <div className="input-group-register right-side-register">
            <label htmlFor="course" className="label-register">
              Course or Program<span className="required"> *</span>
            </label>

            <input
              id="course"
              name="course"
              value={formData.course}
              onChange={handleCourseChange}
              onBlur={handleAnyInputBlur}
              className="input-field-register course-select"
              required
            />
            {/* dito dropdown */}
            {filteredCourses.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-md mt-1 max-h-60 overflow-y-auto">
                {filteredCourses.map((course, i) => (
                  <li
                    key={i}
                    onMouseDown={() => handleCourseSelect(course)}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    <p>{course.program}</p>
                  </li>
                ))}
              </ul>
            )}

          </div>
        </div>
        <div className="form-row-register">
          <div className="input-group-register full-width-register">
            <label htmlFor="proofOfEnrollment" className="label-register">
              Proof of Enrolment / School ID with Validation<span className="required"> *</span>
            </label>
            <input type="file" id="proofOfEnrollment" name="proofOfEnrollment" onChange={handleAnyInputChange} onBlur={handleAnyInputBlur} className="input-field-register file-input" accept=".jpg,.jpeg,.png,.pdf" required />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2EducationDetails;
