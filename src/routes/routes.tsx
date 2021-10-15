import {
    BrowserRouter,
    Switch,
    Route
} from 'react-router-dom';
import App from '../App';

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={App}></Route>
            <Route path="*" component={() => <h1>Página não encontrada</h1>} />
        </Switch>
    </BrowserRouter>
);

export default Routes;