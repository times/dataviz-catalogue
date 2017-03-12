library(readr)
data <- read_csv("~/Github/times-visual-vocabulary/scatterplot/data.csv")

ggplot(data = data, aes(x = Age,
                        y = Fee)) +
  geom_point(stat = "identity", 
             aes(size = 2, fill = "#254251")) +
  scale_y_continuous(name = "Fee (m£)", 
                     limits = c(0,60), 
                     breaks = seq(0,60,10)) +
  scale_x_continuous(breaks = seq(20,33,1)) +
  annotate("text", 
           x = 25.8, y = 52, 
           label = "Oscar", color="#F37F2F") +
  annotate("text", 
           x = 25.2, y = 24.2, 
           label = "Morgan Schneiderlin", color="#F37F2F") +
  theme(
    plot.background = element_rect(fill = "#f7f8f1"),
    panel.background = element_rect(fill = "#f7f8f1"),
    panel.grid.minor = element_blank(),
    panel.grid.major = element_line(colour = "lightgrey", linetype = "dashed"),
    panel.grid.minor.x = element_blank(),
    panel.grid.major.x = element_blank(),
    legend.position = "none",
    axis.ticks = element_blank(),
    plot.margin = unit(c(1,1,1,1), "cm")
  ) +
  ggsave(filename = "scatterplot-r.svg")

