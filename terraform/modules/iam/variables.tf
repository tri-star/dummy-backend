variable "stage" {
  description = "The stage of the deployment"
  type        = string
}

variable "aws_id" {
  description = "The AWS account ID"
  type        = string
}

variable "owner" {
  description = "The GitHub repository owner"
  type        = string
}

variable "repo" {
  description = "The GitHub repository name"
  type        = string
}
