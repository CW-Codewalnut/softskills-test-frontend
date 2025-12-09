import { useState } from 'react'
import './AdminDashboardPage.css'
import { uploadTestConfig } from '../services/accessService'

const AdminDashboardPage = () => {
    const [testType, setTestType] = useState('listening')
    const [selectedFile, setSelectedFile] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const handleFileChange = (event) => {
        const file = event.target.files?.[0]
        if (!file) return
        setSelectedFile(file)
        setError('')
        setSuccessMessage('')
    }

    const handleSubmit = async () => {
        if (!selectedFile) {
            setError('Please choose a file to upload.')
            return
        }

        try {
            setIsSubmitting(true)
            setError('')
            setSuccessMessage('')

            await uploadTestConfig({ typeOfTest: testType, file: selectedFile })

            // ⭐ Show success popup
            setSuccessMessage('File uploaded successfully.')

            // ⭐ Hide popup automatically after 2 seconds
            setTimeout(() => {
                setSuccessMessage('')
            }, 2000)

            setSelectedFile(null)
        } catch (e) {
            setError(e.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <section className="admin-dashboard">
            <header className="admin-dashboard__header">
                <p className="admin-dashboard__eyebrow">Admin Console</p>
                <h1>Admin Dashboard</h1>
                <p className="admin-dashboard__subcopy">
                    Choose the test type and upload a configuration file.
                </p>
            </header>

            <div className="admin-dashboard__panel">

                {/* Toggle Buttons */}
                <div className="toggle-group">
                    <button
                        className={`toggle-btn ${testType === 'listening' ? 'active' : ''}`}
                        onClick={() => setTestType('listening')}
                    >
                        Listening
                    </button>
                    <button
                        className={`toggle-btn ${testType === 'behaviour' ? 'active' : ''}`}
                        onClick={() => setTestType('behaviour')}
                    >
                        Behaviour
                    </button>
                </div>

                {/* File Upload Area */}
                <label className="file-drop-area">
                    <input type="file" accept=".json,.csv" onChange={handleFileChange} />

                    <div className="file-drop-content">
                        <div className="upload-icon">⬆</div>
                        <p className="drop-text">
                            {selectedFile
                                ? selectedFile.name
                                : 'Drag & drop file here or click to browse'}
                        </p>
                        <p className="file-hint">Accepted: .json, .csv • Max 10MB</p>
                    </div>
                </label>

                {/* Error Message */}
                {error && (
                    <p className="admin-dashboard__message admin-dashboard__message--error">
                        {error}
                    </p>
                )}

                {/* Submit Button */}
                <button
                    type="button"
                    className="admin-dashboard__submit"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Uploading...' : 'Submit'}
                </button>
            </div>

            {/* ⭐ Popup Message */}
            {successMessage && (
                <div className="success-popup">
                    <div className="success-popup-box">
                        <div className="success-icon">✔</div>
                        <p className="success-text">{successMessage}</p>
                    </div>
                </div>
            )}
        </section>
    )
}

export default AdminDashboardPage
