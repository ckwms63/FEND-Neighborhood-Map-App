import React, {Component} from 'react';
import Drawer from '@material-ui/core/Drawer';

class Sidebar extends Component {

  state = {
      open: false,
      search: ""
  }

  render = () => {
    return (

        <Drawer
          open={this.props.open}
          onClose={this.props.toggleDrawer}
        >

          <div className = "sidebar">

            <input
              className = "search"
              type="text"
              placeholder={"Filter stores"}
              name="filter"
              role="search"
              onChange={(e) => this.props.filterFunction(e.target.value)}
              value={this.props.search}
            />

            {
              this.props.filteredVenues &&
              this.props.filteredVenues.length > 0 &&
              this.props.filteredVenues.map((venue, index) => (

                <div
                  key={index}
                  className="list-item"
                  tabIndex="0"
                  onClick={() => {this.props.clickListItem(venue)}}
                >
                  {venue.venue.name}
                </div>
              ))
            }

          </div>
        </Drawer>

    )
  }
}

export default Sidebar;
