import React, { useEffect, useRef, useState } from 'react';

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Image from "react-bootstrap/Image";

import styles from "../../styles/PostPlantCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import { useHistory, useParams } from 'react-router-dom';
import { axiosReq } from "../../api/axiosDefaults";

function PostEditForm() {

    const [errors, setErrors] = useState({});

    const [postData, setPostData] = useState({
        plant: "",
        plant_type: "",
        image: "",
        question: "",
    });
    const { plant, plant_type, image, question } = postData;

    const imageInput = useRef(null);
    const history = useHistory();
    const { id } = useParams();

    useEffect(() => {
        const handleMount = async () => {
            try {
                const { data } = await axiosReq.get(`/posts/${id}`);
                const { plant, plant_type, image, question, is_owner } = data;
                is_owner ? setPostData({ plant, plant_type, image, question }) : history.push('/');
            } catch (err) {
                // console.log(err);
            }
        };
        handleMount();
    }, [history, id]);

    const handleChange = (event) => {
        setPostData({
            ...postData,
            [event.target.name]: event.target.value,
        });
    };

    const handleChangeImage = (event) => {
        if (event.target.files.length) {
            URL.revokeObjectURL(image);
            setPostData({
                ...postData,
                image: URL.createObjectURL(event.target.files[0]),
            });
        }
    };
    // Function to handle form submission sending data to the API
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();

        formData.append('plant', plant);
        formData.append('plant_type', plant_type);
        formData.append('question', question);

        if (imageInput?.current?.files[0]) {
            formData.append('image', imageInput.current.files[0]);
        }



        try {
            await axiosReq.put(`/posts/${id}`, formData);
            history.push(`/posts/${id}`);
        } catch (err) {
            // console.log(err)
            if (err.response?.status !== 401) {
                setErrors(err.response?.data);
            }
        }
    };

    const plantFields = (
        <div className='text-center'>
            <Form.Group>
                <Form.Label className="d-none">Plant Name</Form.Label>
                <Form.Control
                    type="text"
                    name="plant"
                    placeholder='Plant name'
                    value={plant}
                    onChange={handleChange}
                    className={appStyles.Input}
                />
            </Form.Group>
            {errors?.plant?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                    {message}
                </Alert>
            ))}
            <Form.Group>
                <Form.Label className="d-none">Plant Type</Form.Label>
                <Form.Control as="select" name="plant_type" value={plant_type} onChange={handleChange} className={appStyles.Input}>
                    <option value="palms">Palms</option>
                    <option value="ferns">Ferns</option>
                    <option value="indoor_trees">Indoor Trees</option>
                    <option value="cacti_and_succulents">Cacti and Succulents</option>
                    <option value="hydroculture">Hydroculture</option>
                    <option value="foliage plants">Foliage plants</option>
                    <option value="bonsai">Bonsai</option>
                </Form.Control>
            </Form.Group>
            <Form.Group>
                <Form.Label className="d-none">Question</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={6}
                    name="question"
                    placeholder='Ask your question here ...'
                    value={question}
                    onChange={handleChange}
                    className={appStyles.Textarea}

                />
            </Form.Group>
            {errors.question?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                    {message}
                </Alert>
            ))}

            <Button className={`${btnStyles.Button}`} type="submit">
                Save
            </Button>
            <Button className={`${btnStyles.Button}`} onClick={() => history.goBack()}>
                Cancel
            </Button>
        </div>
    );
    return (
        <Form onSubmit={handleSubmit}>
            <Row>
                <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
                    <Container className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}>
                        <Form.Group className='text-center'>
                            <figure>
                                <Image className={appStyles.Image} src={image} />
                            </figure>
                            <div>
                                <Form.Label
                                    className={`${btnStyles.Button} btn`}
                                    htmlFor='image-upload'
                                >
                                    Replace image
                                </Form.Label>
                            </div>
                            <Form.File
                                id="image-upload"
                                accept="image/*"
                                onChange={handleChangeImage}
                                ref={imageInput}
                            />
                        </Form.Group>
                        {errors?.image?.map((message, idx) => (
                            <Alert variant="warning" key={idx}>
                                {message}
                            </Alert>
                        ))}
                        <div className='d-md-none'>{plantFields}</div>
                    </Container>
                </Col>
                <Col md={5} lg={4} className="d-none d-md-block p-0 p-md-2">
                    <Container className={`${appStyles.Content} ${styles.Container}`}>
                        {plantFields}
                    </Container>
                </Col>
            </Row>
        </Form>
    );
}

export default PostEditForm;