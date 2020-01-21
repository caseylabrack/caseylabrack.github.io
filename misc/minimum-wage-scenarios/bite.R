library(tidyverse)

source("CBO.R")

data = read_csv("bite.csv") %>% 
  filter(!(option %in% c("rtw", "rtw_ap"))) %>% 
  separate(option, into = c("targetYear", "wage", "tipped", "indexed"), sep = "_") %>%
  filter(targetYear==2026) %>% 
  select(-c(targetYear)) %>% 
  mutate(workforceAffected = workforceAffected * 100) %>% 
  filter(indexed==1) %>% 
  filter(tipped==0)

data$year = factor(data$year, levels = data$year %>% unique())
data$wage = factor(data$wage, levels = data$wage %>% unique(),
                   labels = paste0("$", seq(10,15,1)))

ggplot(data, aes(x = workforceAffected, y = wageIncrease, color = year)) +
  geom_path(color = hcl(0,0,50)) +
  # geom_point(size = 5, alpha = .75, shape = 21, stroke = 2) +
  geom_point(size = 5, shape = 16, alpha = 1) +
  ggtitle("Minimum Wage") +
  scale_y_continuous(expand = c(0,0), limits = c(0,25), name = "Average Mandated\nPercentage Increase\nin Wages") +
  scale_x_continuous(expand = c(0,0), limits = c(0,15), name = "Percentage of Directly Affected Workers") +
  scale_color_manual(values = c("#fddcf1", "#f3bae4", "#e09dd6", "#c385c6", "#9c73b2", "#736397", "#4f537a", "#34405b", "#212d3e", "#131a22"),
                     name = "Year",
                     # labels = c("2020", "", "", "2023", "", "", "2026", "", "", "2029"),
                     labels = rep("", 10)) +
  facet_wrap(vars(wage)) +
  theme(axis.title.x = axisTitle,
        axis.title.y = element_text(family = "Proxima Nova T Cond", size = 9, face = "plain", hjust = 1, color = "#4C4B4C",
                                    margin = margin(t = 0, l = 0, b = 2, r = 12, unit = "pt"))) +
  theme(legend.position = "bottom") +
  guides(col = guide_legend(nrow = 1, title.position = "top", label.position = "bottom")) +
  theme(legend.key = element_blank()) +
  theme(legend.spacing.x = unit(0, "pt"))

ggsave("bite.pdf", width = 7, height = 7, units = "in")