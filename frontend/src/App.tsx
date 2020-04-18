import React, { useState, useEffect, useCallback, MouseEvent } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import ProgressBar from "react-bootstrap/ProgressBar";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import * as superagent from "superagent";

import { useDropzone } from "react-dropzone";

interface File {
    readonly name: string;
    readonly size: number;
}

function App() {
    const [progress, setProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);
    const [files, setFiles] = useState([]);
    const [uploads, setUploads] = useState([] as Array<File>);

    function doUpload(event: MouseEvent<HTMLButtonElement>) {
        let http = superagent.post("http://localhost:5000/upload");
        files.forEach(file => {
            http = http.attach("file", file);
        });
        http.on("progress", e => {
            if (e.direction === "upload" && e.percent) {
                setIsUploading(true);
                setProgress(e.percent);
                console.log(e);
            }
        }).end((err, response) => {
            setIsUploading(false);
            setProgress(0);
            setFiles([]);
            if (err) {
                setError(err);
            } else {
                setUploads(response.body);
            }
        });
        event.preventDefault();
    }
    const onDrop = useCallback(acceptedFiles => {
        setFiles(files => files.concat(acceptedFiles));
        setError(null);
    }, []);

    useEffect(() => {
        // Similar to componentDidMount and componentDidUpdate:
        document.title = "Personal File Server";
    });
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop
    });

    function listFiles() {
        superagent.get("http://localhost:5000/files").end((err, response) => {
            if (err) {
                setError(err);
            } else if (response.body) {
                setUploads(response.body as Array<File>);
            }
        });
    }
    return (
        <Container>
            {error !== null ? (
                <Row>
                    <Col>
                        <Card bg={"danger"} text="white">
                            <Card.Body {...getRootProps()}>
                                <Card.Title>Error</Card.Title>
                                <Card.Text>{`${error}`}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            ) : null}
            <Row>
                <Col sm>
                    <ListGroup>
                        {uploads.map(file => {
                            if ("name" in file) {
                                return (
                                    <ListGroup.Item>
                                        <a
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            href={`http://localhost:5000/uploads/${file.name}`}
                                        >
                                            {file.name}
                                        </a>
                                    </ListGroup.Item>
                                );
                            } else {
                                return null;
                            }
                        })}
                        <ListGroup.Item>{uploads.length} files</ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col sm>
                    <Card>
                        {files.length === 0 ? (
                            <Card.Body {...getRootProps()}>
                                <Card.Title>Upload Files</Card.Title>
                                <input {...getInputProps()} />

                                {isDragActive ? (
                                    <Card.Text>
                                        Drop the files here ...
                                    </Card.Text>
                                ) : (
                                        <Card.Text>
                                            Drag 'n' drop some files here, or click
                                            to select files.
                                        </Card.Text>
                                    )}
                            </Card.Body>
                        ) : isUploading ? null : (
                            <Card.Body>
                                <h1>Ready to upload!</h1>
                            </Card.Body>
                        )}

                        {files.length > 0 ? (
                            <Card.Body>
                                {isUploading ? (
                                    <Card.Text>Uploading ...</Card.Text>
                                ) : (
                                        <Button onClick={doUpload}>
                                            Upload {files.length} file(s)
                                        </Button>
                                    )}
                            </Card.Body>
                        ) : null}
                    </Card>
                </Col>
                <Col sm></Col>
            </Row>
            {progress > 0 ? (
                <Row>
                    <Col sm></Col>
                    <Col sm>
                        <ProgressBar now={progress} label={`${progress}%`} />
                    </Col>
                    <Col sm></Col>
                </Row>
            ) : null}
            <Button onClick={listFiles}>List Files</Button>
        </Container>
    );
}

export default App;
