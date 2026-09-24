import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, useForm } from '@inertiajs/react';
import { Shield, Info, Lock, Send } from 'lucide-react';
import styles from './ReportViolation.module.scss';
import toast from 'react-hot-toast';

export default function ReportViolation() {
    const [isAnonymous, setIsAnonymous] = React.useState(false);
    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        school: '',
        incidentType: '',
        description: '',
        evidence: '',
        attested: false,
        isAnonymous: false
    });

    const incidentTypes = [
        'Gender-Based Harassment (Bawal Bastos)',
        'Bullying / Cyberbullying',
        'Abuse of Authority',
        'Discrimination',
        'Other'
    ];

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route('report.violation.store'), {
            onSuccess: () => {
                toast.success('Report submitted successfully.');
                reset();
                setIsAnonymous(false);
            },
            onError: () => {
                toast.error('Failed to submit report. Please check the form.');
            }
        });
    };

    // Update isAnonymous in form data when toggle changes
    const handleAnonymousChange = (checked) => {
        setIsAnonymous(checked);
        setData(prev => ({
            ...prev,
            isAnonymous: checked,
            name: checked ? '' : prev.name,
            school: checked ? '' : prev.school
        }));
    };

    return (
        <MainLayout>
            <Head title="Report Violation" />

            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.badge}>
                        <Shield size={14} />
                        <span>MSL Integrity Portal</span>
                    </div>
                    <h1>Safe Spaces Reporting</h1>
                    <p>
                        In compliance with <strong>Republic Act 11313 (Safe Spaces Act)</strong>, MSL Philippines is committed to maintaining a harassment-free environment for all student-gamers.
                    </p>
                </div>

                <div className={styles.content}>
                    <div className={styles.infoBox}>
                        <Info className={styles.icon} size={20} />
                        <div className={styles.infoContent}>
                            <h3>Zero Tolerance Policy</h3>
                            <p>
                                This form covers incidents of gender-based sexual harassment, bullying, cyber-harassment, and abuse of authority within the MSL ecosystem (Tournaments, Discord, Campus Events).
                            </p>
                            <p>
                                <a href="#">For Child Protection (Minors under 18)</a>, we strictly adhere to RA 7610. Reports involving minors are prioritized immediately.
                            </p>
                        </div>
                    </div>

                    <form className={styles.formCard} onSubmit={handleSubmit}>
                        <div className={styles.toggleSection}>
                            <div className={styles.toggleLabel}>
                                <Lock
                                    size={20}
                                    className={isAnonymous ? styles.active : styles.inactive}
                                />
                                <div>
                                    <h3>File Anonymously</h3>
                                    <p>Your identity will be hidden from the accused.</p>
                                </div>
                            </div>
                            <label className={styles.switch}>
                                <input
                                    type="checkbox"
                                    checked={isAnonymous}
                                    onChange={(e) => handleAnonymousChange(e.target.checked)}
                                />
                                <span className={styles.slider}></span>
                            </label>
                        </div>

                        {!isAnonymous && (
                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label>Your Name</label>
                                    <input
                                        type="text"
                                        placeholder="Juan dela Cruz"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required={!isAnonymous}
                                    />
                                    {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
                                </div>
                                <div className={styles.formGroup}>
                                    <label>School / Organization</label>
                                    <input
                                        type="text"
                                        placeholder="University Name"
                                        value={data.school}
                                        onChange={(e) => setData('school', e.target.value)}
                                        required={!isAnonymous}
                                    />
                                    {errors.school && <div className="text-red-500 text-xs mt-1">{errors.school}</div>}
                                </div>
                            </div>
                        )}

                        <div className={styles.formGroup}>
                            <label>Type of Incident</label>
                            <select
                                value={data.incidentType}
                                onChange={(e) => setData('incidentType', e.target.value)}
                                required
                            >
                                <option value="" disabled>Select incident type</option>
                                {incidentTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                            {errors.incidentType && <div className="text-red-500 text-xs mt-1">{errors.incidentType}</div>}
                        </div>

                        <div className={styles.formGroup}>
                            <label>Description of Incident</label>
                            <textarea
                                placeholder="Please provide specific details: Who, When, Where, and What happened."
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                required
                            />
                            {errors.description && <div className="text-red-500 text-xs mt-1">{errors.description}</div>}
                        </div>

                        <div className={styles.formGroup}>
                            <label>Evidence (Optional)</label>
                            <div className={styles.evidenceBox}>
                                <p>Paste links to screenshots/videos or drive folders here</p>
                                <input
                                    type="url"
                                    placeholder="https://"
                                    value={data.evidence}
                                    onChange={(e) => setData('evidence', e.target.value)}
                                />
                            </div>
                            {errors.evidence && <div className="text-red-500 text-xs mt-1">{errors.evidence}</div>}
                        </div>

                        <div className={styles.checkboxGroup}>
                            <input
                                type="checkbox"
                                id="attest"
                                checked={data.attested}
                                onChange={(e) => setData('attested', e.target.checked)}
                                required
                            />
                            <label htmlFor="attest">
                                I attest that the information provided is true to the best of my knowledge. I understand that filing a false report is a violation of the MSL Code of Conduct.
                            </label>
                            {errors.attested && <div className="text-red-500 text-xs mt-1">{errors.attested}</div>}
                        </div>

                        <button type="submit" className={styles.submitButton} disabled={processing}>
                            <span>{processing ? 'Submitting...' : 'Submit Report'}</span>
                            <Send size={16} />
                        </button>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}
