library(tidyverse)

source("CBO.R")

data = read_csv("reduction-in-employment.csv") %>% 
  filter(!(option %in% c("rtw", "rtw_ap"))) %>% 
  separate(option, into = c("targetYear", "wage", "tipped", "indexed"), sep = "_") %>% 
  filter(targetYear==2026) %>% 
  select(-targetYear) %>% 
  filter(tipped==0) %>% 
  select(-c(tipped))

data$wage = factor(data$wage, levels = data$wage %>% unique(),
                   labels = c("$10","$11","$12","$13","$14","$15"))

data$indexed = factor(data$indexed, levels = data$indexed %>% unique(),
                      labels = c("Wage Index:\nNone", "Wage Index:\nCPI", "Wage Index:\nMedian Wage"))

ggplot(data, aes(x = year, y = employmentChange, ymin = lowEnd, ymax = highEnd)) +
  geom_line(color = hcl(270,70,50), size = lineWidth) +
  geom_ribbon(fill = hcl(270,70,50), alpha = .25) +
  baselineLine() +
  ggtitle("Minimum Wage") +
  scale_x_continuous(expand = c(0,0), breaks = c(2020,2029)) +
  scale_y_continuous(expand = c(0,0), limits = c(-3,.1), breaks = c(-3,-2,-1,-.5,0), labels = c("-3","-2","-1","-.5","0")) +
  facet_grid(cols = vars(wage), rows = vars(indexed)) +
  theme(strip.text.y = element_text(angle = 0, hjust = 0))

ggsave("employment.pdf", width = 7, height = 7, units = "in")