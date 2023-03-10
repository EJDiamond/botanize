import React, { useEffect, useState } from 'react';

import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";

import { Link, useLocation } from 'react-router-dom';
import { axiosReq } from '../../api/axiosDefaults';

import btnStyles from '../../styles/Button.module.css';
import appStyles from "../../App.module.css";
import NoResults from "../../assets/no-results.png";
import Plant from './Plant';
import Asset from '../../components/Asset';
import InfiniteScroll from 'react-infinite-scroll-component';
import { fetchMoreData } from '../../utils/utils';
import PlantWhisperers from '../profiles/PlantWhisperers';

function PlantsPage({ filter = "", message }) {
    const [plants, setPlants] = useState({ results: [] });
    const [hasLoaded, setHasLoaded] = useState(false);
    const { pathname } = useLocation();

    useEffect(() => {
        const fetchPlants = async () => {
            try {
                const { data } = await axiosReq.get(`/plants/`);
                setPlants(data);
                setHasLoaded(true);
            } catch (err) {
                // console.log(err)
            }
        };
        setHasLoaded(false)
        const timer = setTimeout(() => {
            fetchPlants();
        }, 1000);
        return () => {
            clearTimeout(timer);
        };
    }, [pathname]);

    return (
        <Row className='h-100'>
            <Col className='d-none d-lg-block p-0 p-lg-2' lg={3}>
                <PlantWhisperers />
            </Col>
            <Col className='py-2 p-0 p-lg-2' lg={6}>
                <PlantWhisperers mobile />
                <div className={`${appStyles.Content} ${appStyles.Header} text-center mb-2`}>
                    <strong>Plants from the community</strong>
                    <div>
                        <Link to="/plants/create">
                            <button className={btnStyles.LeafButton}>
                                <OverlayTrigger placement='bottom' overlay={<Tooltip>Add plants</Tooltip>}>
                                    <i className={`fa-solid fa-leaf ${btnStyles.LeafIcon}`}></i>
                                </OverlayTrigger>
                            </button>
                        </Link>
                    </div>
                </div>

                {hasLoaded ? (
                    <>
                        {plants.results.length ? (
                            <InfiniteScroll
                                children={plants.results.map((plant) => (
                                    <Plant key={plant.id} {...plant} setPlants={setPlants} />
                                ))
                                }
                                dataLength={plants.results.length}
                                loader={<Asset spinner />}
                                hasMore={!!plants.next}
                                next={() => fetchMoreData(plants, setPlants)}
                            />
                        ) : (
                            <Container className={appStyles.Content}>
                                <Asset src={NoResults} message={message} />
                            </Container>
                        )}
                    </>
                ) : (
                    <Container className={appStyles.Content}>
                        <Asset spinner />
                    </Container>
                )}
            </Col>
            <Col className='d-none d-lg-block p-0 p-lg-2' lg={3}>
                <Image className="position-fixed" src="https://res.cloudinary.com/ejdiamo/image/upload/v1674561489/hanging-plant_q9kptl.png" alt='hanging plant' />
            </Col>
        </Row >
    )
}

export default PlantsPage;