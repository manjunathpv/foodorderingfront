import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Header from '../../common/header/Header';
import RestaurantInfo from './RestaurantInfo';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';

import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import Divider from '@material-ui/core/Divider';

import Snackbar from '@material-ui/core/Snackbar';




import './Details.css';

const styles = theme => ({
    card: {
        maxWidth: 'inherit'
    }
});




class Details extends Component {

    constructor() {
        super();
        this.state = {
            address: {},
            restaurantInfo: {},
            categories: [],
            locality: '',
            totalItemCount: 0,
            totalAmount: 0,
            selectedItems: [],
            snackbarOpen: false,
            snackbarMsg: ''

        }
    }

    getUnique = (arr, comp) => {

    const unique = arr
        .map(e => e[comp])

        // store the keys of the unique objects
        .map((e, i, final) => final.indexOf(e) === i && i)

        // eliminate the dead keys & store unique objects
        .filter(e => arr[e]).map(e => arr[e]);

    return unique;
}

componentWillMount() {
    let that = this;
    let url = `http://localhost:8080/api/restaurant/${this.props.match.params.id}`;
    return fetch(url, { method: 'GET' })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Something went wrong ...');
            }
        })
        .then(data => {
            let categories = this.getUnique(data.categories, 'id');
            for (let index = 0; index < categories.length; index++) {
                let item_list = this.getUnique(categories[index].item_list, 'id');
                categories[index]['item_list'] = item_list;
            }
            this.setState({ restaurantInfo: data, address: data.address, categories: categories, locality: data.address.locality.toUpperCase() })
        })
        .catch(error => console.log('error login data', error));
}

/* Push to the selectedItems Array
 * Add the Item To Cart
 */
addItemToCart = (item) => {
    console.log(item);
    item['count'] = item.count || 1;
    item['costOfItem'] = item.price;
    let selectedItems = this.state.selectedItems;
    let totalAmount = this.state.totalAmount;
    let sameItem = false;
    selectedItems.forEach((singleItem, index) => {
        if (singleItem.item_name === item.item_name) {
            sameItem = true;
            singleItem.count = ++singleItem.count;
            console.log("Abhis");
            singleItem.costOfItem = singleItem.price * singleItem.count;
            totalAmount = totalAmount + singleItem.price;
            return index;
        }
    });

    if (sameItem) {
        this.setState(prevState => {
            return {
                totalItemCount: prevState.totalItemCount + 1,
                selectedItems: selectedItems,
                totalAmount: totalAmount,
                snackbarOpen: true,
                snackbarMsg: "Item added to cart!"
            }
        })
    } else {
        this.setState(prevState => {
            return {
                totalItemCount: prevState.totalItemCount + 1,
                selectedItems: prevState.selectedItems.concat(item),
                totalAmount: prevState.totalAmount + item.costOfItem,
                snackbarOpen: true,
                snackbarMsg: "Item added to cart!"
            }
        })
    }
}

/* 
* Update an element to the selected Item Array
* Update Total Amount/ Total Count of Item in Badge/ Total Price of an item
* Increase the No.of Items in the cart.
*/
addItemToCartFromCart = item => {

    let selectedItems = this.state.selectedItems;
    let totalAmount = this.state.totalAmount;
    let itemToUpdate = selectedItems.filter(singleItem => singleItem.item_name === item.item_name)[0];
    itemToUpdate.count = ++item.count;
    itemToUpdate.costOfItem = itemToUpdate.price * itemToUpdate.count;
    let idx = selectedItems.forEach((singleItem, index) => {
        if (singleItem.item_name === item.item_name) {
            totalAmount = totalAmount + singleItem.price;
            console.log(totalAmount);
            return index;
        }
    });
    selectedItems[idx] = itemToUpdate;
    this.setState(prevState => {
        return {
            totalItemCount: prevState.totalItemCount + 1,
            selectedItems: selectedItems,
            totalAmount: totalAmount,
            snackbarOpen: true,
            snackbarMsg: "Item quantity increased by 1!"
        }
    })
}

removeItemFromCart = item => {
    let selectedItems = this.state.selectedItems;
    let totalAmount = this.state.totalAmount;
    let itemToUpdate = selectedItems.filter(singleItem => singleItem.item_name === item.item_name)[0];
    itemToUpdate.count = --item.count;
    itemToUpdate.costOfItem = itemToUpdate.price * itemToUpdate.count;
    let idx = selectedItems.forEach((singleItem, index) => {
        if (singleItem.item_name === item.item_name) {
            totalAmount = totalAmount - singleItem.price;
            console.log(totalAmount);
            return index;
        }
    });



    selectedItems[idx] = itemToUpdate;

    selectedItems = selectedItems.filter(singleItem => singleItem.count > 0);

    this.setState(prevState => {
        return {
            totalItemCount: prevState.totalItemCount - 1,
            selectedItems: selectedItems,
            totalAmount: totalAmount,
            snackbarOpen: true,
            snackbarMsg: "Item removed from cart!"
        }
    })
}

snackbarClose = event => {
    this.setState({ snackbarOpen: false })
}

checkoutButtonHandler = event => {
    const isUserLoggedIn = sessionStorage.getItem("loggedIn");
    if (!isUserLoggedIn)
        this.setState({ snackbarOpen: true, snackbarMsg: "Please login first!" });
    if (this.state.selectedItems.length === 0)
        this.setState({ snackbarOpen: true, snackbarMsg: "Please add an item to your cart!" });
}

render() {
    return (
        <div>
            <Header />
            <RestaurantInfo restaurantdetail={this.state.restaurantInfo} address={this.state.address} categories={this.state.categories} locality={this.state.locality} />
            <Grid container>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    {this.state.categories.map((category, index) => (
                        <div className="category-list" key={index}>
                            <div >
                                <Typography variant="display1" style={{ fontSize: 15 }}>{category.category_name.toUpperCase()}</Typography>
                                <Divider style={{ marginTop: 10 }} />
                            </div>
                            {category.item_list.map((item, index) => (
                                <List key={index}>
                                    <ListItem>
                                        <div><i className={"fa fa-circle " + (item.item_type === "VEG" ? "veg" : "non-veg")} aria-hidden="true"></i></div>
                                        <ListItemText primary={item.item_name.charAt(0).toUpperCase() + item.item_name.slice(1)} />
                                        <div className="pr50"><i className="fa fa-inr" aria-hidden="true"></i><span className="pl10">{item.price.toFixed(2)}</span></div>
                                        <ListItemSecondaryAction>
                                            <IconButton edge="end" onClick={() => this.addItemToCart(item)}>
                                                <AddIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                </List>
                            ))}
                        </div>
                    ))}
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                    <div className="card-container mobile-center">
                        <Card>
                            <CardContent>
                                <div className="mb15 mobile-left">
                                    <Badge badgeContent={this.state.totalItemCount} showZero color="primary">
                                        <ShoppingCartIcon />
                                    </Badge>
                                    <span className="cart-text">My Cart</span>
                                </div>
                                {this.state.selectedItems !== [] && this.state.selectedItems.map((item, index) => (
                                    <Grid container key={index}>
                                        <Grid item lg={8} md={6} sm={5} xs={5}>
                                            <div className="align-center">
                                                <span className="cart-vegnonvegicon"><i className={"fa fa-stop-circle-o " + (item.item_type === "VEG" ? "veg" : "non-veg")} aria-hidden="true"></i></span>
                                                <span>{item.item_name}</span>
                                            </div>
                                        </Grid>
                                        <Grid item lg={2} md={3} sm={3} xs={3}>
                                            <div>
                                                <IconButton color="inherit" onClick={() => this.removeItemFromCart(item)} className="btn-hoverfocus">
                                                    <RemoveIcon fontSize="small" />
                                                </IconButton>
                                                <span>{item.count}</span>
                                                <IconButton color="inherit" size="small" onClick={() => this.addItemToCartFromCart(item)} className="btn-hoverfocus">
                                                    <AddIcon fontSize="small" />
                                                </IconButton>
                                            </div>
                                        </Grid>
                                        <Grid item lg={2} md={3} sm={4} xs={4}>
                                            <div className="cart-itemprice"><i className="fa fa-inr mr5" aria-hidden="true"></i><span>{item.costOfItem.toFixed(2)}</span></div>
                                        </Grid>

                                    </Grid>
                                ))}
                                <Grid container>
                                    <Grid item lg={6} md={6} sm={6} xs={6}>
                                        <div className="align-center">
                                            <span className="total-amount">TOTAL AMOUNT</span>
                                        </div>
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={6} xs={6}>
                                        <span className="float-right p12"><i className="fa fa-inr" aria-hidden="true"></i><span className="ml5">{this.state.totalAmount.toFixed(2)}</span></span>
                                    </Grid>
                                </Grid>
                            </CardContent>
                            <CardActions>
                                <div className="btn-container">
                                    <Button variant="contained" onClick={this.checkoutButtonHandler} color="primary" fullWidth>CHECKOUT</Button>
                                </div>
                            </CardActions>
                        </Card>
                    </div>
                </Grid>
            </Grid>
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                open={this.state.snackbarOpen}
                autoHideDuration={3000}
                onClose={this.snackbarClose}
                message={<span id="message-id">{this.state.snackbarMsg}</span>}
                action={[
                    <IconButton key="close" aria-label="Close" color="inherit" onClick={this.snackbarClose}>x</IconButton>
                ]}
            />
        </div >
    )
}
}

export default withStyles(styles)(Details)