library(tidyverse)

source("CBO.R")

data = read_csv("idr.csv") %>%
  gather(key = income, value = value, 2:6)

data$type = factor(data$type, levels = data$type %>% unique())
data$borrowers = factor(data$borrowers, levels = data$borrowers %>% unique())
data$income = factor(data$income, levels = data$income %>% unique())

p1 = ggplot(data %>% filter(type=="Undergraduate"), aes(x = borrowers, y = income, fill = value, width = .95, height = .95)) +
  geom_tile() +
  ggtitle("Undergraduate") +
  scale_fill_viridis_c(option = "plasma", direction = 1, name = "Amount Forgiven (Percent)", limits = c(0,max(data$value))) +
  scale_x_discrete(expand = c(0,0), name = "Amount Borrowed",
                   labels = c("< $6,362", rep("", 3), " > $31,600")) +
  scale_y_discrete(expand = c(0,0), name = "Borrower's Income",
                   labels = c("< $21,000", rep("", 3), " > $67,000")) +
  theme(axis.ticks = element_blank(),
        axis.line = element_blank()) +
  theme(axis.title.x = element_text(family = "Proxima Nova T Cond", size = 9, face = "plain", hjust = .5, color = neutral,
                                    margin = margin(t = 0, r = 0, b = 0, l = 0, unit = "pt"))) +
  theme(axis.title.y = element_text(family = "Proxima Nova T Cond", size = 9, face = "plain", hjust = 0, color = neutral, 
                                    margin = margin(t = 0, r = 12, b = 0, l = 0, unit = "pt"))) +
  theme(plot.margin = margin(t = 6, r = 16, b = 24, l = 0, unit = "pt"))


p2 = ggplot(data %>% filter(type!="Undergraduate"), aes(x = borrowers, y = income, fill = value, width = .95, height = .95)) +
  geom_tile() +
  ggtitle("Graduate") +
  scale_fill_viridis_c(option = "plasma", direction = 1, name = "Amount Forgiven (Percent)", limits = c(0,max(data$value))) +
  scale_x_discrete(expand = c(0,0), name = "Amount Borrowed",
                   labels = c("< $36,976", rep("", 3), "> $120,210")) +
  scale_y_discrete(expand = c(0,0), name = "Borrower's Income",
                   labels = c("< $38,000", rep("", 3), "> $110,000")) +
  theme(axis.ticks = element_blank(),
        axis.line = element_blank()) +
  theme(axis.title.x = axisTitle) +
  theme(axis.title.y = element_text(family = "Proxima Nova T Cond", size = 9, face = "plain", hjust = 0, color = neutral,
                                    margin = margin(t = 0, r = 12, b = 0, l = 0, unit = "pt"))) +
  theme(legend.position = "bottom", legend.key.size = unit(24,"pt")) +
  theme(legend.text = element_text(family = "Proxima Nova T Cond", size = 9, face = "plain", color = neutral, hjust = .5,
                                   margin = margin(t = 0, r = 6, b = 0, l = 0, unit = "pt")))

g <- egg::ggarrange(
  p1, p2,
  ncol = 1
)

ggsave("plot.pdf", plot = g, width = 4.75, height = 6.5, units = "in")