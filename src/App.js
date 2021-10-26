import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Spinner, Table, Alert } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import axios from "axios";

function App() {

  const [ psychologists, setPsychologists ] = useState(null)
  const [ isLoading, setIsloading ] = useState(false)
  const [ error, setError ] = useState(false)

  const handled_select = async select_value => {
    
    setIsloading(true)

    let url_1 = "https://gist.githubusercontent.com/diegoacuna/3a2c8246ec6df3dbc9426b852dd8842b/raw/3f7898ac9f5792f4cfc54c689300708a9b9751ae/react_fullstack_recommendations_1.json"

    let url_2 = "https://gist.githubusercontent.com/diegoacuna/0c7d5508a3af22dd1922eb98156bb402/raw/f5e87043c1e676354c9c723b0bfd23d2094a6be1/react_fullstack_recommendations_2.json"

    try {
      let response = await axios.get( select_value === "1" ? url_1 : url_2 )
      setPsychologists(() => {
          let ia = [], db = [], ua = [], others = []
          response.data.forEach(
            psychologist => {
              switch( psychologist.source ) {
                case "IA":
                  return ia=[ ...ia, psychologist ]
                case "DB":
                  return db=[ ...db, psychologist ]
                case "UA":
                  return ua=[ ...ua, psychologist ]
                default:
                  return others=[ ...others, psychologist ]
              }
            }
          )
          return ia.concat(db, ua, others)
        }
      )
      setError(false)
      setIsloading(false)
    } catch(error){
      setIsloading(false)
      setError(true)
      console.log(error)
    }
  }


  useEffect(() => { console.log(psychologists) }, [ psychologists, error ])
  

  return (
    <div className="App p-4 m-4">
      <Container>
        <Row>
          <Col lg="3">
            <div className="d-flex justify-content-center pb-4 mb-4">
              <Form.Select
                aria-label="Select EndPoint"
                onChange={ val => handled_select(val.target.value) }
              >
                <option value="0">Selecciona un Endpoint</option>
                <option value="1">EndPoint 1</option>
                <option value="2">EndPoint 2</option>
              </Form.Select>
            </div>
          </Col>
          <Col lg="12">
            { isLoading &&
              <div className="d-flex justify-content-center my-4 py-4">
                <div className="d-flex align-items-center flex-column">
                  <Spinner animation="grow" size="lg"/>
                  <h6 className="pt-2" style={{ color: "#98A2AC" }}>Cargando...</h6>
                </div>
              </div>
            }
            { error &&
              <Alert variant="danger" onClose={() => setError(false)} dismissible>
                <Alert.Heading>Oh snap! Existe un Error!</Alert.Heading>
                <p>
                  Actualiza la pagina o vuelve a seleccionar el endpoint...
                </p>
              </Alert>
            }

            { psychologists !== null &&
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Nombre Y Apellido</th>
                    <th>Experiencia</th>
                  </tr>
                </thead>
                <tbody>
                  { psychologists && psychologists.map( (psychologist, index) =>
                    <tr key={`${psychologist.psychologist.id}ps-${index}`}>
                      <td>{ psychologist.psychologist.name || "" }</td>
                      <td>{ psychologist.psychologist.expertise.join(", ") }</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            }
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
