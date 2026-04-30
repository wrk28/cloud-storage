import { useSelector } from "react-redux";

const PreviewFileModal = ({ onClose }) => {
    const previewFile = useSelector((state) => state.files.previewFile);
    const isFileDownloaded = useSelector((state) => state.files.isPreviewFileDownloaded);

    if(!isFileDownloaded){
        return null;
    }

    const { file, content_type } = previewFile;
    
    return(
    <div className="modal-backdrop">
        <div className="modal-content">
        <h3>Preview File</h3>
            {content_type?.startsWith('image/') && 
                <img className="preview-img" src={`data:${content_type};base64,${file}`} />
            }
            {content_type?.startsWith('text/') &&
                <pre className="preview-text">
                    {atob(file)}
                </pre>
            }
            {content_type?.startsWith('audio/') &&
                <audio className="preview-audio" controls>
                    <source src={`data:${content_type};base64,${file}`} />
                    This audio type is not supported by your browser
                </audio>
            }
            {content_type?.startsWith('video/') &&
                <video className="preview-video" controls>
                    <source src={`data:${content_type};base64,${file}`} />
                    This video type is not supported by your browser
                </video>
            }
            {content_type?.startsWith('application/pdf') &&
                    <iframe className="preview-pdf"
                        src={`data:${content_type};base64,${file}`}
                    />
            }
        <div className="modal-buttons">
            <button onClick={onClose}>Close</button>
        </div>
        </div>
    </div>
    );
};

export default PreviewFileModal;