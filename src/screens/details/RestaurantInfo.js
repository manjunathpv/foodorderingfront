import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import './RestaurantInfo.css';

const styles = theme => ({
    typeText:{
      fontSize: 20
    }
})

const RestaurantInfo = props => {

    const categoryArr = props.categories;
    let categoryNamesArr = [];
    categoryArr.forEach(element => {
        if (categoryNamesArr.indexOf(element.category_name) === -1)
            categoryNamesArr.push(element.category_name);
    });
    const categoryNames = categoryNamesArr.join(', ');

    return (
        
        <div>
            <Grid container className="grid-container pb15">
                <Grid item xs={12} sm={3} md={3} lg={3}>
                    <div className="mobile-center">
                        <img src={props.restaurantdetail.photo_URL} alt={props.restaurantdetail.restaurant_name}/>
                    </div>
                </Grid>
                <Grid item xs={12} sm={9} md={9} lg={9}>
                    <div className="header-section mobile-center">
                        <span className="header-title">{props.restaurantdetail.restaurant_name}</span>
                        <div className="mtb10">
                            <Typography variant="subtitle2">{props.locality}</Typography>
                        </div>
                        <div className="mt10">
                            <Typography variant="subtitle2">{categoryNames}</Typography>
                        </div>
                        <Grid container>
                            <Grid item xs={6} sm={6} md={6} lg={6}>
                                <div className="mt10"><i className="fa fa-star" aria-hidden="true"></i><span className="pl5">{props.restaurantdetail.customer_rating}</span></div>
                                <Typography variant="display1" className="pt10" style={{fontSize: 10}}>AVERAGE RATING BY</Typography>
                                <Typography variant="display1" style={{fontSize: 10}}>{props.restaurantdetail.number_customers_rated} CUSTOMERS</Typography>
                            </Grid>
                            <Grid item xs={6} sm={6} md={6} lg={6}>
                            <div className="mt10"><i className="fa fa-inr" aria-hidden="true"></i><span className="pl5">{props.restaurantdetail.average_price}</span></div>
                                <Typography variant="display1" className="pt10" style={{fontSize: 10}}>AVERAGE COST FOR</Typography>
                                <Typography variant="display1" style={{fontSize: 10}}>TWO PEOPLE</Typography>
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}

export default withStyles(styles)(RestaurantInfo);