# Load following libraries
library(ggplot2)
library(readr)

# Load CSV file containing data
# Note: the path to the file must be correct!
# It can be a local file or a URL
data <- read_csv("../data.csv")

# Replace Age and Fee in the example by the variables you want
# on x and y in your plot
ggplot(data = data, aes(x = Age,
                        y = Fee)) +

# Fill colour defaults to Times blue
  geom_point(stat = "identity", 
             aes(size = 2, fill = "#254251")) +

# Name and label of the y axis
# Limits sets up to and from where runs our axis
# Breaks sets the tick placements
  scale_y_continuous(name = "Fee (m£)", 
                     limits = c(0,60), 
                     breaks = seq(0,60,10)) +

# Breaks sets the tick placements
# on our x axis
  scale_x_continuous(breaks = seq(20,33,1)) +

# Annotation layer
# Use x/y coordinates similar to the one you'd use
# if you were placing a point on the plot
  annotate("text", 
           x = 25.8, y = 52, 
           label = "Oscar", color="#F37F2F") +
  annotate("text", 
           x = 25.2, y = 24.2, 
           label = "Morgan Schneiderlin", color="#F37F2F") +

# Theming
  theme(
    plot.background = element_rect(fill = "#f7f8f1"),     # on buff
    panel.background = element_rect(fill = "#f7f8f1"),    # on buff
    panel.grid.minor = element_blank(),                   # no small lines
    panel.grid.major = element_line(colour = "lightgrey", linetype = "dashed"),
    panel.grid.minor.x = element_blank(),                 # no x axis rules
    panel.grid.major.x = element_blank(),                 # no x axis rules
    legend.position = "none",                             # no legend
    axis.ticks = element_blank(),                         # no ticks
    plot.margin = unit(c(1,1,1,1), "cm")
  ) +

# Export to SVG
  ggsave(filename = "scatterplot-r.svg")

