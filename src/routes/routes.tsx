import {
    BrowserRouter,
    Switch,
    Route
} from 'react-router-dom';

import Home from '../pages/Home';
import Search from '../pages/Search';
import Details from '../pages/Details';

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={Home}></Route>
            <Route exact path="/search" component={Search}></Route>
            <Route exact path="/details" component={Details}></Route>
            <Route path="*" component={() => <h1>Página não encontrada</h1>} />
        </Switch>
    </BrowserRouter>
);

export default Routes;